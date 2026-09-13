import { generateAIResponse, getProductContext, getUserContext } from '../services/aiService.js';
import logger from '../config/logger.js';

export const handleChat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Get contexts
    const productsContext = await getProductContext(message);
    
    // Check if user is authenticated (using existing req.user from protect middleware, if applied)
    let userContext = null;
    if (req.user) {
      userContext = await getUserContext(req.user._id);
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message, conversationHistory, productsContext, userContext);

    // Return the response along with the products that were found so the frontend can render them
    res.status(200).json({
      success: true,
      message: aiResponse,
      products: productsContext, // Send back matched products to render UI cards
    });
  } catch (error) {
    logger.error('Error in AI chat controller:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Failed to process AI request. Please try again.' });
  }
};
