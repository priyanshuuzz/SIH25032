import React, { useState } from 'react';
import { MessageCircle, Send, Bot, User, X, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Namaskar! Welcome to Jharkhand Tourism. I can help you with information about destinations, bookings, and cultural experiences. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickReplies = [
    'Show me top destinations',
    'Plan a 3-day itinerary',
    'Find local guides',
    'Tribal culture experiences',
    'Waterfall locations',
    'Booking assistance'
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      let botResponse = "I understand you're asking about " + inputMessage + ". Let me help you with that!";
      
      if (inputMessage.toLowerCase().includes('destination') || inputMessage.toLowerCase().includes('place')) {
        botResponse = "Jharkhand has amazing destinations! I recommend Netarhat for hill stations, Hundru Falls for waterfalls, Betla National Park for wildlife, and Deoghar for spiritual tourism. Would you like detailed information about any of these?";
      } else if (inputMessage.toLowerCase().includes('itinerary') || inputMessage.toLowerCase().includes('plan')) {
        botResponse = "I'd be happy to help plan your trip! For a 3-day itinerary, I suggest: Day 1 - Deoghar temples, Day 2 - Netarhat hill station, Day 3 - Hundru Falls. Would you like me to customize this based on your interests?";
      } else if (inputMessage.toLowerCase().includes('culture') || inputMessage.toLowerCase().includes('tribal')) {
        botResponse = "Jharkhand's tribal culture is fascinating! You can experience Sohrai festival, learn Dokra art, watch traditional dances, and stay in tribal homestays. Our cultural tours include visits to artisan villages and participation in local ceremonies.";
      } else if (inputMessage.toLowerCase().includes('guide')) {
        botResponse = "We have verified local guides available! Birsa Munda Jr. specializes in wildlife and culture (₹2,500/day), Manju Devi for cultural tours (₹2,200/day), and Suresh Kumar for adventure activities (₹3,000/day). Shall I show you their profiles?";
      }

      const aiMessage = {
        id: messages.length + 2,
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputMessage('');
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold">Jharkhand Assistant</h3>
                <p className="text-xs opacity-80 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-start">
                    {msg.type === 'bot' && (
                      <Bot className="w-4 h-4 mr-2 mt-0.5 text-emerald-600" />
                    )}
                    {msg.type === 'user' && (
                      <User className="w-4 h-4 mr-2 mt-0.5 text-white" />
                    )}
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
              <div className="flex flex-wrap gap-1">
                {quickReplies.slice(0, 3).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;