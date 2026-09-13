import { GoogleGenAI } from '@google/genai';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { buildSystemPrompt } from '../utils/aiPrompt.js';
import logger from '../config/logger.js';

let ai;

export const initializeAI = () => {
  const provider = process.env.AI_PROVIDER || 'gemini';
  const apiKey = process.env.AI_API_KEY;

  if (provider === 'gemini' && apiKey && apiKey !== 'dummy_key_for_now') {
    try {
      if (!ai) {
        ai = new GoogleGenAI({ apiKey });
      }
      logger.info('Gemini AI Provider initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Gemini AI Provider:', error.message);
    }
  } else {
    logger.warn('AI_API_KEY is not set or is dummy. AI responses will be mocked.');
  }
};

export const getProductContext = async (message) => {
  try {
    // Simple heuristic to find products: search for keywords in the message
    // A production app might use Atlas Vector Search here
    const keywords = message.split(' ').filter(w => w.length > 3).map(w => w.toLowerCase());
    
    let query = { isActive: true };
    if (keywords.length > 0) {
      const regexPatterns = keywords.map(kw => new RegExp(kw, 'i'));
      query = {
        ...query,
        $or: [
          { name: { $in: regexPatterns } },
          { description: { $in: regexPatterns } },
          { usageInstructions: { $in: regexPatterns } }
        ]
      };
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('brand', 'name')
      .select('_id name description price discountPrice countInStock rating numReviews usageInstructions category brand images')
      .limit(10)
      .lean();

    return products;
  } catch (error) {
    logger.error('Error fetching product context:', error);
    return [];
  }
};

export const getUserContext = async (userId) => {
  try {
    if (!userId) return null;

    // Fetch latest 3 orders for context
    const recentOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('_id status totalAmount createdAt')
      .lean();

    return {
      recentOrders: recentOrders.map(o => ({
        id: o._id,
        status: o.status,
        total: o.totalAmount,
        date: o.createdAt
      }))
    };
  } catch (error) {
    logger.error('Error fetching user context:', error);
    return null;
  }
};

export const generateAIResponse = async (message, conversationHistory, products, userContext) => {
  const apiKey = process.env.AI_API_KEY;
  
  // Explicitly check for missing/dummy key to trigger mock mode
  if (!apiKey || apiKey === 'dummy_key_for_now') {
    return `[Mock AI] I am a mock assistant. Key is: "${apiKey}".`;
  }

  // Attempt on-demand initialization if not already initialized
  if (!ai) {
    try {
      ai = new GoogleGenAI({ apiKey });
    } catch (error) {
      logger.error('Failed to initialize Gemini AI Provider on-demand:', error.message);
      throw new Error('AI service is temporarily unavailable. Please try again.');
    }
  }

  const model = process.env.AI_MODEL || 'gemini-3.6-flash';
  
  let contextString = `PRODUCTS CONTEXT:\n`;
  if (products && products.length > 0) {
    contextString += products.map(p => 
      `- ID: ${p._id}, Name: ${p.name}, Price: ₹${p.price}, Stock: ${p.countInStock}, Rating: ${p.rating}, Category: ${p.category?.name || 'N/A'}`
    ).join('\n');
  } else {
    contextString += 'No matching products found.\n';
  }

  if (userContext) {
    contextString += `\nUSER CONTEXT:\n`;
    if (userContext.recentOrders && userContext.recentOrders.length > 0) {
      contextString += `Recent Orders: ${userContext.recentOrders.map(o => `Order ${o.id} is ${o.status} (Total: ₹${o.total})`).join(', ')}\n`;
    } else {
      contextString += `No recent orders.\n`;
    }
  }

  const systemInstruction = buildSystemPrompt() + '\n\n' + contextString;

  try {
    // We construct a simple conversation history for the model
    let history = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      history = conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: systemInstruction }] }, // System instruction as first user message in Gemini if not using system_instruction param, but let's use config
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemInstruction, // Gemini supports this
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    logger.error('Error generating AI response. ' + error.message);
    throw new Error('AI service is temporarily unavailable. Please try again.');
  }
};
