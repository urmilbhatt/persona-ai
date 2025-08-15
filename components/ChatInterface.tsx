'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, User, Bot, Loader2 } from 'lucide-react';
import { Persona, Message } from '../types';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface ChatInterfaceProps {
  persona: Persona;
  onBack: () => void;
}

export default function ChatInterface({ persona, onBack }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentSession, addMessage, addChatSession, activeProvider } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!activeProvider) {
      toast.error('Please configure an LLM provider in settings first');
      return;
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date(),
      personaId: persona.id,
    };

    // Add user message to chat
    if (currentSession) {
      addMessage(currentSession.id, userMessage);
    } else {
      // Create new session if none exists
      const newSession = {
        id: `session_${Date.now()}`,
        personaId: persona.id,
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addChatSession(newSession);
    }

    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          personaId: persona.id,
          sessionId: currentSession?.id,
          llmProviderId: activeProvider.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: `msg_${Date.now()}_bot`,
        content: data.content,
        role: 'assistant',
        timestamp: new Date(),
        personaId: persona.id,
      };

      if (currentSession) {
        addMessage(currentSession.id, botMessage);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const messages = currentSession?.messages || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Chat Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {persona.avatar ? (
              <img
                src={persona.avatar}
                alt={persona.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              persona.name.charAt(0)
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{persona.name}</h2>
            <p className="text-gray-600">{persona.description}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="card h-96 overflow-y-auto mb-6">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-gray-500"
            >
              <Bot size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium">Start a conversation with {persona.name}</p>
              <p className="text-sm">Ask them anything about their expertise or just have a casual chat!</p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-start space-x-3 mb-4 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={`max-w-xs lg:max-w-md ${
                  message.role === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start space-x-3 mb-4"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex space-x-3">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Message ${persona.name}...`}
          className="textarea-field flex-1 resize-none"
          rows={3}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="btn-primary self-end disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
}
