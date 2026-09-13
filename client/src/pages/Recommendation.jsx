import React, { useState, useEffect, useRef } from 'react';
import { useSendChatMessageMutation } from '../redux/slices/aiApiSlice';
import { useDispatch } from 'react-redux';
import { useAddToCartMutation } from '../redux/slices/cartApiSlice';
import { toast } from 'react-toastify';
import { FaRobot, FaUser, FaPaperPlane, FaMicrophone, FaLeaf, FaSearch, FaBox, FaShoppingCart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const Recommendation = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [sendChatMessage, { isLoading }] = useSendChatMessageMutation();
  const navigate = useNavigate();
  const [addToCart, { isLoading: isAddingCart }] = useAddToCartMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const savedChats = localStorage.getItem('agriAssistantMessages');
    if (savedChats) {
      try {
        setMessages(JSON.parse(savedChats));
      } catch (e) {
        console.error('Failed to parse chats', e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('agriAssistantMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Create conversation history for context
      const history = messages.map(m => ({ role: m.role, content: m.content })).slice(-5);
      
      const res = await sendChatMessage({ message: text, conversationHistory: history }).unwrap();
      
      const aiMsg = { 
        role: 'ai', 
        content: res.message, 
        products: res.products,
        timestamp: new Date().toISOString() 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      if (err.data && err.data.message) {
        toast.error(err.data.message);
      } else if (err.status === 401) {
        toast.error('You need to log in to use this feature.');
      } else if (err.status === 429) {
        toast.error('Too many requests. Please slow down.');
      } else if (err.status === 404) {
        toast.error('AI service endpoint not found.');
      } else if (err.status === 'FETCH_ERROR') {
        toast.error('Network error. Is the server running?');
      } else {
        toast.error('Sorry, I am having trouble connecting right now. Please try again.');
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('agriAssistantMessages');
  };

  const quickPrompts = [
    "Which fertilizer is best for tomatoes?",
    "Show me organic fertilizers",
    "Where is my order?",
    "Products under ₹500"
  ];

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input is not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    toast.info("Listening...");

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setInputValue(speechResult);
      handleSendMessage(speechResult);
    };

    recognition.onerror = (event) => {
      toast.error('Voice recognition error.');
    };
  };

  const formatAIResponse = (text) => {
    return (
      <div className="markdown-content text-sm leading-relaxed whitespace-pre-wrap">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {text}
        </ReactMarkdown>
      </div>
    );
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, qty: 1 }).unwrap();
      toast.success('Product added to cart!');
    } catch (err) {
      toast.error('Failed to add product to cart.');
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="bg-primary text-white p-4 rounded-t-lg shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FaRobot className="text-3xl" />
          <div>
            <h1 className="text-xl font-bold m-0">Agri Assistant</h1>
            <p className="text-sm opacity-80 m-0">Your smart farming and shopping assistant</p>
          </div>
        </div>
        <div>
          <button onClick={handleClearChat} className="text-sm underline mr-4 hover:text-gray-200">Clear Chat</button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-50 overflow-y-auto p-4 border-l border-r border-gray-200 shadow-inner flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
            <FaLeaf className="text-6xl text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
            <p className="mb-6">Ask about fertilizers, crops, orders, and more.</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-white border border-primary text-primary px-4 py-2 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] md:max-w-[70%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  {msg.role === 'user' ? <FaUser /> : <FaRobot />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                  {msg.role === 'user' ? (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    formatAIResponse(msg.content)
                  )}
                  
                  {/* Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      {msg.products.map(product => (
                        <div key={product._id} className="w-48 border border-gray-200 rounded-lg p-3 bg-gray-50 flex flex-col gap-2">
                          <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-32 object-contain bg-white rounded" />
                          <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                          <p className="text-primary font-bold">₹{product.price}</p>
                          <div className="flex gap-2 mt-auto">
                            <Link to={`/product/${product._id}`} className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-xs py-1.5 rounded">View</Link>
                            <button onClick={() => handleAddToCart(product._id)} className="flex-1 bg-primary text-white hover:bg-green-700 text-xs py-1.5 rounded">Add</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className={`text-[10px] mt-2 text-right ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] flex gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-100 text-green-600">
                <FaRobot />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-100 rounded-tl-none shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 rounded-b-lg shadow-md border-t border-gray-200">
        {/* Quick Actions (Desktop) */}
        <div className="hidden md:flex gap-4 mb-3 text-sm text-gray-500 overflow-x-auto pb-2">
          <button onClick={() => handleSendMessage('Recommend fertilizer')} className="flex items-center gap-1 hover:text-primary whitespace-nowrap"><FaLeaf /> Crop Advice</button>
          <button onClick={() => handleSendMessage('Find products')} className="flex items-center gap-1 hover:text-primary whitespace-nowrap"><FaSearch /> Find Products</button>
          <button onClick={() => handleSendMessage('Where is my order?')} className="flex items-center gap-1 hover:text-primary whitespace-nowrap"><FaBox /> Track Order</button>
          <button onClick={() => handleSendMessage('What is in my cart?')} className="flex items-center gap-1 hover:text-primary whitespace-nowrap"><FaShoppingCart /> My Cart</button>
        </div>

        <div className="flex items-end gap-2">
          <button 
            onClick={handleVoiceInput}
            className="p-3 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-colors mb-1"
            title="Voice Input"
          >
            <FaMicrophone />
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about fertilizers, crops, products, orders..."
            className="flex-1 resize-none border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent max-h-32"
            rows={1}
            style={{ minHeight: '50px' }}
            disabled={isLoading || isTyping}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading || isTyping}
            className="p-3 bg-primary text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-1 shadow-md"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
