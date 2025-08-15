'use client';

import { motion } from 'framer-motion';
import { MessageCircle, User, Star } from 'lucide-react';
import { Persona } from '../types';

interface PersonaGridProps {
  personas: Persona[];
  onPersonaSelect: (persona: Persona) => void;
}

export default function PersonaGrid({ personas, onPersonaSelect }: PersonaGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {personas.map((persona, index) => (
        <motion.div
          key={persona.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
          onClick={() => onPersonaSelect(persona)}
        >
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
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
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  {persona.name}
                </h3>
                {!persona.isCustom && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {persona.isCustom ? 'Custom Persona' : 'Pre-built Persona'}
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {persona.description}
          </p>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Expertise:</h4>
            <div className="flex flex-wrap gap-2">
              {persona.expertise.slice(0, 3).map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {persona.expertise.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{persona.expertise.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>{persona.personality.split(' ').slice(0, 3).join(' ')}...</span>
            </div>
            <div className="flex items-center space-x-2 text-primary-600 font-medium">
              <MessageCircle className="w-4 h-4" />
              <span>Chat Now</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
