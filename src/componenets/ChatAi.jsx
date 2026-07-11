import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatAi.css';
import ChatForm from './ChatForm';
import ChatMessage from './ChatMessage';
import BotIcon from './BotIcon';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { MdAutoAwesome, MdRefresh } from 'react-icons/md';
import { IoSparkles, IoChatbubbleEllipses } from 'react-icons/io5';

// Quick-reply starter prompts — shown only before the first message
const SUGGESTIONS = [
  'How am I doing lately?',
  "I'm feeling stressed today",
  'Tips for better sleep',
];

const ChatAi = () => {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // Best-guess before the first reply arrives; the backend confirms the
  // real value (context may still be unavailable for brand-new users).
  const [personalized, setPersonalized] = useState(false);
  const chatBodyRef = useRef();

  const firstName = user?.fullName?.split(' ')[0];

  useEffect(() => {
    setPersonalized(user?.settings?.personalizedAI !== false && !!user);
  }, [user]);

  // The backend builds a context-aware system prompt from the user's own
  // wellness history (subject to their privacy setting) and calls Gemini
  // server-side — the API key never touches the browser.
  const sendMessage = async (userMessage) => {
    const nextHistory = [...chatHistory, { role: 'user', text: userMessage }];
    setChatHistory(nextHistory);
    setIsTyping(true);

    try {
      const res = await api.post('/chat', { history: nextHistory });
      setChatHistory((prev) => [...prev, { role: 'model', text: res.data.reply }]);
      setPersonalized(!!res.data.personalized);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: 'model', text: error.message }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => setChatHistory([]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory, isTyping]);

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
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-40 bottom-40 right-2 sm:right-9 w-[calc(100vw-16px)] max-w-xs md:max-w-md max-h-[min(32rem,calc(100vh-15rem))] overflow-hidden bg-white dark:bg-darkCard rounded-2xl shadow-2xl flex flex-col border border-black/5"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary via-primary to-[#048a48] px-4 md:px-6 py-3.5 md:py-4 overflow-hidden">
              {/* Soft decorative glow */}
              <motion.div
                aria-hidden
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <BotIcon className="h-9 w-9 p-1.5 fill-white bg-white/20 rounded-full" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-primary" />
                  </div>
                  <div>
                    <h2 className="text-white text-sm font-semibold leading-none">MediBloom AI</h2>
                    <p className="text-white/70 text-xs mt-0.5">Mental wellness assistant</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {chatHistory.length > 0 && (
                    <button
                      onClick={handleReset}
                      aria-label="Start a new conversation"
                      title="New conversation"
                      className="h-8 w-8 text-white/80 hover:text-white rounded-full transition bg-white/10 hover:bg-white/20 flex items-center justify-center"
                    >
                      <MdRefresh className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowChatbot(false)}
                    aria-label="Close chatbot"
                    className="material-symbols-rounded h-9 w-9 text-white cursor-pointer text-xl rounded-full transition bg-white/10 hover:bg-white/20 flex items-center justify-center"
                  >
                    keyboard_arrow_down
                  </button>
                </div>
              </div>

              {/* Personalization indicator */}
              {user && (
                <div className="relative flex items-center gap-1.5 mt-2.5">
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
              className="overflow-y-auto scroll-thin flex flex-col gap-4 md:gap-5 flex-1 min-h-[12rem] sm:min-h-[16rem] px-4 md:px-6 py-4 md:py-5 bg-gray-50 dark:bg-darkBg"
            >
              {/* Personalized default greeting */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 md:gap-3"
              >
                <BotIcon className="h-8 w-8 md:h-9 md:w-9 p-1.5 flex-shrink-0 fill-white self-end mb-0.5 bg-primary rounded-full" />
                <p className="px-3.5 py-2.5 md:px-4 md:py-3 max-w-[78%] break-words text-sm bg-white dark:bg-white/10 text-gray-700 dark:text-gray-100 rounded-t-xl rounded-bl-md shadow-sm leading-relaxed">
                  {firstName ? `Hey ${firstName} 👋` : 'Hey there 👋'}
                  <br />
                  How can I help you today?
                </p>
              </motion.div>

              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} userAvatar={user?.avatar} />
              ))}

              {isTyping && (
                <ChatMessage chat={{ role: 'model', text: '' }} isTyping />
              )}

              {/* Quick-reply suggestions — only before the conversation starts */}
              {chatHistory.length === 0 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-wrap gap-2 pl-10"
                >
                  {SUGGESTIONS.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => sendMessage(s)}
                      className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20 px-3 py-1.5 rounded-full transition-colors"
                    >
                      <IoSparkles className="w-3 h-3 flex-shrink-0" />
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white dark:bg-darkCard px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 dark:border-white/10">
              <ChatForm onSend={sendMessage} disabled={isTyping} autoFocus={showChatbot} />
              <p className="flex items-center gap-1 justify-center text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                <IoChatbubbleEllipses className="w-2.5 h-2.5" />
                Not a substitute for professional care
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAi;
