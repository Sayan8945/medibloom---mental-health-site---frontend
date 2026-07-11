import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatAi.css';
import ChatForm from './ChatForm';
import ChatMessage from './ChatMessage';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { MdAutoAwesome } from 'react-icons/md';

const BotIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    className={className}
    aria-hidden="true"
  >
    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
  </svg>
);

const ChatAi = () => {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  // Best-guess before the first reply arrives; the backend confirms the
  // real value (context may still be unavailable for brand-new users).
  const [personalized, setPersonalized] = useState(false);
  const chatBodyRef = useRef();

  useEffect(() => {
    setPersonalized(user?.settings?.personalizedAI !== false && !!user);
  }, [user]);

  // The backend builds a context-aware system prompt from the user's own
  // wellness history (subject to their privacy setting) and calls Gemini
  // server-side — the API key never touches the browser.
  const generateBotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== ' . . . . .'),
        { role: 'model', text },
      ]);
    };

    try {
      const res = await api.post('/chat', { history });
      updateHistory(res.data.reply);
      setPersonalized(!!res.data.personalized);
    } catch (error) {
      updateHistory(error.message);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);

  return (
    <>
      {/* Toggle button */}
      <motion.button
        id="chatbot-toggler"
        onClick={() => setShowChatbot((v) => !v)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 1 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        aria-label={showChatbot ? 'Close chatbot' : 'Open chatbot'}
        style={{ position: 'fixed', bottom: '90px', right: '20px', zIndex: 50 }}
      >
        {/* Pulse ring — only when closed */}
        {!showChatbot && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-primary"
              animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-primary"
              animate={{ scale: [1, 1.3], opacity: [0.35, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
            />
          </>
        )}

        {/* Icon — rotates on toggle */}
        <AnimatePresence mode="wait">
          <motion.span
            key={showChatbot ? 'close' : 'chat'}
            className="material-symbols-rounded"
            aria-hidden="true"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ position: 'absolute' }}
          >
            {showChatbot ? 'close' : 'mode_comment'}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed z-40 bottom-40 right-2 sm:right-9 w-[calc(100vw-16px)] max-w-xs md:max-w-md overflow-hidden bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="bg-primary px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BotIcon className="h-9 w-9 p-1.5 flex-shrink-0 fill-white bg-white/20 rounded-full" />
                  <div>
                    <h2 className="text-white text-sm font-semibold leading-none">MediBloom AI</h2>
                    <p className="text-white/70 text-xs mt-0.5">Mental wellness assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatbot(false)}
                  aria-label="Close chatbot"
                  className="material-symbols-rounded h-9 w-9 text-white cursor-pointer text-xl rounded-full transition bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  keyboard_arrow_down
                </button>
              </div>

              {/* Personalization indicator */}
              {user && (
                <div className="flex items-center gap-1.5 mt-2.5">
                  <MdAutoAwesome className="w-3 h-3 text-white/70 flex-shrink-0" />
                  <span className="text-white/70 text-[11px] font-medium leading-none">
                    {personalized
                      ? 'Personalized using your wellness history'
                      : 'Generic AI responses enabled'}
                  </span>
                </div>
              )}
            </div>

            {/* Body */}
            <div
              ref={chatBodyRef}
              className="overflow-y-auto scroll-thin flex flex-col gap-4 md:gap-5 h-64 sm:h-72 md:h-80 max-h-[60vh] px-4 md:px-6 py-4 md:py-5 bg-gray-50"
            >
              {/* Default greeting */}
              <div className="flex gap-3">
                <BotIcon className="h-8 w-8 p-1.5 flex-shrink-0 fill-white self-end mb-0.5 bg-primary rounded-full" />
                <p className="px-4 py-3 max-w-[78%] break-words text-sm bg-white rounded-t-xl rounded-bl-md shadow-sm leading-relaxed">
                  Hey there 👋
                  <br />
                  How can I help you today?
                </p>
              </div>

              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>

            {/* Footer */}
            <div className="bg-white px-4 md:px-6 py-3 md:py-4 border-t border-gray-100">
              <ChatForm
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                generateBotResponse={generateBotResponse}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAi;
