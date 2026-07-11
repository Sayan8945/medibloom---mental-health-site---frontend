import { motion } from 'framer-motion';
import { IoPersonCircle } from 'react-icons/io5';
import BotIcon from './BotIcon';

// Animated "typing" dots — shown instead of text while the bot is thinking
const TypingDots = () => (
  <span className="flex items-center gap-1 py-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-300"
        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
      />
    ))}
  </span>
);

const ChatMessage = ({ chat, userAvatar, isTyping = false }) => {
  const isBot = chat.role === 'model';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={isBot ? 'flex gap-2 md:gap-3' : 'flex gap-2 md:gap-3 justify-end'}
    >
      {isBot && (
        <BotIcon className="h-8 w-8 md:h-9 md:w-9 p-1.5 flex-shrink-0 fill-white self-end mb-0.5 bg-primary rounded-full" />
      )}

      <div
        className={
          isBot
            ? 'px-3.5 py-2.5 md:px-4 md:py-3 max-w-[78%] break-words whitespace-pre-line text-sm leading-relaxed bg-white dark:bg-white/10 text-gray-700 dark:text-gray-100 rounded-t-xl rounded-bl-md shadow-sm'
            : 'px-3.5 py-2.5 md:px-4 md:py-3 max-w-[78%] break-words whitespace-pre-line text-sm leading-relaxed text-white bg-primary rounded-t-xl rounded-br-md shadow-sm shadow-primary/20'
        }
      >
        {isTyping ? <TypingDots /> : chat.text}
      </div>

      {!isBot && (
        userAvatar
          ? <img src={userAvatar} alt="" referrerPolicy="no-referrer" className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0 self-end mb-0.5 rounded-full object-cover" />
          : <IoPersonCircle className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0 self-end mb-0.5 text-gray-300 dark:text-gray-500" />
      )}
    </motion.div>
  );
};

export default ChatMessage;
