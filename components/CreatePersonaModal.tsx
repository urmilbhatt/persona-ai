'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CreatePersonaRequest } from '../types';
import toast from 'react-hot-toast';

interface CreatePersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePersonaModal({ isOpen, onClose }: CreatePersonaModalProps) {
  const { addPersona } = useStore();
  const [formData, setFormData] = useState<CreatePersonaRequest>({
    name: '',
    description: '',
    personality: '',
    expertise: [''],
    tone: '',
    avatar: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CreatePersonaRequest, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExpertiseChange = (index: number, value: string) => {
    const newExpertise = [...formData.expertise];
    newExpertise[index] = value;
    setFormData(prev => ({ ...prev, expertise: newExpertise }));
  };

  const addExpertise = () => {
    setFormData(prev => ({ ...prev, expertise: [...prev.expertise, ''] }));
  };

  const removeExpertise = (index: number) => {
    if (formData.expertise.length > 1) {
      const newExpertise = formData.expertise.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, expertise: newExpertise }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.personality.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.expertise.some(exp => !exp.trim())) {
      toast.error('Please fill in all expertise fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const newPersona = {
        id: `persona_${Date.now()}`,
        ...formData,
        expertise: formData.expertise.filter(exp => exp.trim()),
        isCustom: true,
        createdAt: new Date(),
      };

      addPersona(newPersona);
      toast.success('Persona created successfully!');
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        personality: '',
        expertise: [''],
        tone: '',
        avatar: '',
      });
    } catch (error) {
      console.error('Error creating persona:', error);
      toast.error('Failed to create persona. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create Custom Persona</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input-field"
                    placeholder="Enter persona name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => handleInputChange('avatar', e.target.value)}
                    className="input-field"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="textarea-field"
                  rows={3}
                  placeholder="Describe what this persona does, their background, etc."
                  required
                />
              </div>

              {/* Personality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personality *
                </label>
                <textarea
                  value={formData.personality}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                  className="textarea-field"
                  rows={3}
                  placeholder="Describe their personality traits, how they behave, etc."
                  required
                />
              </div>

              {/* Expertise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Expertise *
                </label>
                <div className="space-y-2">
                  {formData.expertise.map((exp, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={exp}
                        onChange={(e) => handleExpertiseChange(index, e.target.value)}
                        className="input-field flex-1"
                        placeholder={`Expertise ${index + 1}`}
                        required
                      />
                      {formData.expertise.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExpertise(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExpertise}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <Plus size={16} />
                    <span>Add another expertise</span>
                  </button>
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Communication Tone *
                </label>
                <textarea
                  value={formData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                  className="textarea-field"
                  rows={2}
                  placeholder="Describe how they communicate (e.g., formal, casual, technical, friendly)"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Persona'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
