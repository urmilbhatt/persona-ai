'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LLMProvider, LLMType } from '../types';
import { llmService } from '../services/llmService';
import toast from 'react-hot-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { llmProviders, addLLMProvider, updateLLMProvider, deleteLLMProvider, setActiveProvider, activeProvider } = useStore();
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [editingProvider, setEditingProvider] = useState<LLMProvider | null>(null);
  const [isAddingProvider, setIsAddingProvider] = useState(false);

  const toggleApiKeyVisibility = (providerId: string) => {
    setShowApiKeys(prev => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const handleAddProvider = () => {
    setIsAddingProvider(true);
    setEditingProvider({
      id: `provider_${Date.now()}`,
      name: '',
      apiKey: '',
      model: '',
      isActive: false,
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
        tokensPerMinute: 10000,
      },
      usage: {
        requestsThisMinute: 0,
        requestsThisHour: 0,
        tokensThisMinute: 0,
        lastReset: new Date(),
      },
    });
  };

  const handleEditProvider = (provider: LLMProvider) => {
    setEditingProvider(provider);
    setIsAddingProvider(false);
  };

  const handleSaveProvider = () => {
    if (!editingProvider) return;

    if (!editingProvider.name.trim() || !editingProvider.apiKey.trim() || !editingProvider.model.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate API key format
    const providerType = getProviderType(editingProvider.name);
    if (!llmService.validateAPIKey(providerType, editingProvider.apiKey)) {
      toast.error('Invalid API key format');
      return;
    }

    try {
      if (isAddingProvider) {
        addLLMProvider(editingProvider);
        toast.success('LLM provider added successfully!');
      } else {
        updateLLMProvider(editingProvider.id, editingProvider);
        toast.success('LLM provider updated successfully!');
      }
      
      setEditingProvider(null);
      setIsAddingProvider(false);
    } catch (error) {
      console.error('Error saving provider:', error);
      toast.error('Failed to save provider. Please try again.');
    }
  };

  const handleDeleteProvider = (providerId: string) => {
    if (activeProvider?.id === providerId) {
      setActiveProvider(null);
    }
    deleteLLMProvider(providerId);
    toast.success('LLM provider deleted successfully!');
  };

  const getProviderType = (name: string): LLMType => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('openai') || lowerName.includes('gpt')) return 'openai';
    if (lowerName.includes('gemini') || lowerName.includes('google')) return 'gemini';
    if (lowerName.includes('claude') || lowerName.includes('anthropic')) return 'claude';
    return 'openai'; // default
  };

  const getProviderIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('openai') || lowerName.includes('gpt')) return '🤖';
    if (lowerName.includes('gemini') || lowerName.includes('google')) return '🔮';
    if (lowerName.includes('claude') || lowerName.includes('anthropic')) return '🧠';
    return '⚡';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* LLM Providers Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">LLM Providers</h3>
                  <button
                    onClick={handleAddProvider}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>Add Provider</span>
                  </button>
                </div>

                {/* Provider List */}
                <div className="space-y-4">
                  {llmProviders.map((provider) => (
                    <div key={provider.id} className="card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getProviderIcon(provider.name)}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{provider.name}</h4>
                            <p className="text-sm text-gray-500">Model: {provider.model}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setActiveProvider(provider)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              activeProvider?.id === provider.id
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {activeProvider?.id === provider.id ? 'Active' : 'Set Active'}
                          </button>
                          
                          <button
                            onClick={() => handleEditProvider(provider)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          >
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDeleteProvider(provider.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Rate Limit Info */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Requests/Hour:</span>
                            <span className="ml-2 font-medium">{provider.usage.requestsThisHour}/{provider.rateLimit.requestsPerHour}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Tokens/Minute:</span>
                            <span className="ml-2 font-medium">{provider.usage.tokensThisMinute}/{provider.rateLimit.tokensPerMinute}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Status:</span>
                            <span className={`ml-2 font-medium ${
                              provider.isActive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {provider.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit/Add Provider Form */}
              {editingProvider && (
                <div className="card border-2 border-primary-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {isAddingProvider ? 'Add New Provider' : 'Edit Provider'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provider Name *
                      </label>
                      <input
                        type="text"
                        value={editingProvider.name}
                        onChange={(e) => setEditingProvider(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="input-field"
                        placeholder="e.g., OpenAI GPT-4, Google Gemini Pro"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model Name *
                      </label>
                      <input
                        type="text"
                        value={editingProvider.model}
                        onChange={(e) => setEditingProvider(prev => prev ? { ...prev, model: e.target.value } : null)}
                        className="input-field"
                        placeholder="e.g., gpt-4, gemini-pro, claude-3-sonnet"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key *
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKeys[editingProvider.id] ? 'text' : 'password'}
                        value={editingProvider.apiKey}
                        onChange={(e) => setEditingProvider(prev => prev ? { ...prev, apiKey: e.target.value } : null)}
                        className="input-field pr-12"
                        placeholder="Enter your API key"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => toggleApiKeyVisibility(editingProvider.id)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showApiKeys[editingProvider.id] ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingProvider(null)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProvider}
                      className="btn-primary"
                    >
                      {isAddingProvider ? 'Add Provider' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
