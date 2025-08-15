'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import Header from '../components/Header';
import PersonaGrid from '../components/PersonaGrid';
import ChatInterface from '../components/ChatInterface';
import CreatePersonaModal from '../components/CreatePersonaModal';
import SettingsModal from '../components/SettingsModal';
import { Persona } from '../types';

export default function Home() {
  const {
    personas,
    selectedPersona,
    selectPersona,
    isCreatingPersona,
    setCreatingPersona,
    isChatting,
    setChatting,
  } = useStore();

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Auto-select first persona if none selected
    if (!selectedPersona && personas.length > 0) {
      selectPersona(personas[0]);
    }
  }, [personas, selectedPersona, selectPersona]);

  const handlePersonaSelect = (persona: Persona) => {
    selectPersona(persona);
    setChatting(true);
  };

  const handleBackToPersonas = () => {
    setChatting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header onSettingsClick={() => setShowSettings(true)} />
      
      <main className="container mx-auto px-4 py-8">
        {!isChatting ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
                Persona AI
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Chat with AI personas including tech educators like Hitesh Choudhary and Piyush Garg, 
                or create your own custom personas to chat with.
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={() => setCreatingPersona(true)}
                className="btn-primary text-lg px-8 py-3"
              >
                Create Custom Persona
              </button>
            </div>

            <PersonaGrid
              personas={personas}
              onPersonaSelect={handlePersonaSelect}
            />
          </motion.div>
        ) : (
          <ChatInterface
            persona={selectedPersona!}
            onBack={handleBackToPersonas}
          />
        )}
      </main>

      {/* Modals */}
      <CreatePersonaModal
        isOpen={isCreatingPersona}
        onClose={() => setCreatingPersona(false)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
