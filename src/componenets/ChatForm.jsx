import {useRef} from 'react'


const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) => {
  const inputRef = useRef();
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    // update chat history with user's massage
    setChatHistory((history) => [...history, {role: "user", text: userMessage}]);
    // add placeholder for Bot's
    setTimeout(() => {setChatHistory((history) => [...history, {role: "model", text: " . . . . ."}]);
     generateBotResponse([...chatHistory, {role: "user", text: userMessage}]);},600);

   
  }
  return (
    <form className="chat-form flex items-center bg-white rounded-full outline outline-1 outline-[#cccce5] shadow-md focus-within:outline-2 focus-within:outline-[#06a055]"
    onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Message..."
            required
            ref={inputRef}
            className="message-input peer w-full h-10 md:h-12 px-3 md:px-4 text-sm bg-transparent border-none outline-none"
          />
          <button className="material-symbols-rounded hidden h-8 w-8 md:h-9 text-white text-base flex-shrink-0 mr-1.5 rounded-full bg-[#06a055] transition hover:bg-[#023e21] peer-valid:block">
            keyboard_arrow_up
          </button>
    </form>
  )
}

export default ChatForm
