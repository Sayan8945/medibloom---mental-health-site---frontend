import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoSend } from 'react-icons/io5';

// Controlled-ish send box — parent owns the conversation state, this just
// captures a message and hands it off via onSend. Disabled while the bot
// is "typing" so users can't fire off a second message mid-reply.
const ChatForm = ({ onSend, disabled, autoFocus }) => {
  const inputRef = useRef();

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const message = inputRef.current.value.trim();
    if (!message || disabled) return;
    inputRef.current.value = '';
    onSend(message);
  };

  return (
    <form
      className="chat-form flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 rounded-full outline outline-1 outline-gray-200 dark:outline-white/10 shadow-sm focus-within:outline-2 focus-within:outline-primary transition-shadow"
      onSubmit={handleFormSubmit}
    >
      <input
        type="text"
        placeholder={disabled ? 'MediBloom AI is typing…' : 'Type your message…'}
        required
        ref={inputRef}
        disabled={disabled}
        className="message-input peer w-full h-10 md:h-12 px-4 text-sm bg-transparent border-none outline-none placeholder:text-gray-400 dark:text-gray-100 disabled:cursor-not-allowed"
      />
      <motion.button
        type="submit"
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.08 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        aria-label="Send message"
        className="flex-shrink-0 flex items-center justify-center h-9 w-9 md:h-10 md:w-10 mr-1 rounded-full bg-primary text-white shadow-sm shadow-primary/30 transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none"
      >
        <IoSend className="w-4 h-4" />
      </motion.button>
    </form>
  );
};

export default ChatForm;
