import React, { useState, useEffect, useRef } from 'react';

// --- Helper Components ---

// Chat Bubble to open/close the chat window
const ChatBubble = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-5 right-5 z-50 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
    aria-label="Toggle chat window"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  </button>
);

// Header for the Chat Window
const ChatHeader = ({ onClose }) => (
  <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center flex-shrink-0">
    <h3 className="text-lg font-semibold">Your Helping Hand</h3>
    <button onClick={onClose} className="hover:bg-blue-700 rounded-full p-1" aria-label="Close chat window">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

// Component to display the list of messages
const MessageList = ({ messages }) => {
  const endOfMessagesRef = useRef(null);

  // Effect to scroll to the bottom when new messages are added
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    // This div now correctly flexes to fill available space
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`rounded-lg p-3 max-w-xs break-words ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
            <p>{msg.text}</p>
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

// Component for predefined prompts
const PromptSuggestions = ({ prompts, onPromptClick }) => (
  <div className="p-4 border-t border-gray-200 flex-shrink-0">
    <p className="text-sm text-gray-500 mb-2">Or choose a prompt:</p>
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          // FIX: Changed text-sm to text-xs for smaller font
          className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          {prompt}
        </button>
      ))}
    </div>
  </div>
);

// Input form for sending messages
const ChatInput = ({ inputValue, onInputChange, onSendMessage }) => (
  <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl flex-shrink-0">
    <form onSubmit={onSendMessage} className="flex items-center space-x-2">
      <input
        type="text"
        value={inputValue}
        onChange={onInputChange}
        placeholder="Type your message..."
        className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        aria-label="Chat input"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors flex-shrink-0 disabled:bg-blue-300"
        disabled={!inputValue.trim()}
        aria-label="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  </div>
);

// --- Main Chat Widget Component ---
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const prompts = [
    "How can I borrow funds?",
    "Do I need collateral for loan?",
    "abcd",
    "What are the interest rates?",
    "How can I increase my credit limit?",
  ];

  const toggleChat = () => setIsOpen(!isOpen);

  const handlePromptClick = (prompt) => {
    setInputValue(prompt);
  };

  /**
   * Simulates sending a message to an API and getting a response.
   * @param {string} message - The user's message.
   */
  const handleApiCall = async (message) => {
    setIsThinking(true);
    try {
      // Mock API call
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({ title: message }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      const data = await response.json();

      // Add a mock bot response
      const botResponse = `Thanks for your message! You said: "${data.title}". We will help you shortly.`;
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);

    } catch (error) {
      console.error("API call failed:", error);
      const errorResponse = "Sorry, I couldn't connect. Please try again later.";
      setMessages(prev => [...prev, { sender: 'bot', text: errorResponse }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    // Add user message to chat
    setMessages(prev => [...prev, { sender: 'user', text: trimmedInput }]);
    setInputValue('');

    // Call the API
    handleApiCall(trimmedInput);
  };

  // Add a thinking indicator message while waiting for API response
  const displayMessages = isThinking
    ? [...messages, { sender: 'bot', text: 'Thinking...' }]
    : messages;

  return (
    <>
      <ChatBubble onClick={toggleChat} />
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out transform-gpu h-[550px]">
          <ChatHeader onClose={toggleChat} />
          <MessageList messages={displayMessages} />
          <PromptSuggestions prompts={prompts} onPromptClick={handlePromptClick} />
          <ChatInput
            inputValue={inputValue}
            onInputChange={(e) => setInputValue(e.target.value)}
            onSendMessage={handleSendMessage}
          />
        </div>
      )}
    </>
  );
};


export default function App() {
  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {/* Placeholder for your main page content */}
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">DB-Hackathon</h1>
        <p className="text-gray-600 leading-relaxed">
          This is a blank page to demonstrate the floating chat window. The chat component is part of the root layout, so it will remain here even if you navigate to other pages.
          <br /><br />
          Scroll down to see the chat window remain fixed in the bottom right corner.
        </p>
        <div className="h-screen"></div>
        <p className="text-gray-600">You've reached the bottom of the page.</p>
      </div>
      <ChatWidget />
    </div>
  );
}
