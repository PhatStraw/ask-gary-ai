'use client';
import 'dotenv/config'
import { HumanMessage, SystemMessage } from "langchain/schema";
import axios from "axios";
import { useState } from "react";
import Head from "next/head";
import { useChat } from 'ai/react';


const ChatUI = () => {
  // const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  // const [messages, setMessages] = useState([
  //   new SystemMessage({ role: "system", content: "Welcome to the ChatGPT Chat UI!" }),
  // ]);
  // const [inputValue, setInputValue] = useState("");

  // const handleUserMessage = async (message) => {
  //   const userMessage = new HumanMessage({ role: "user", content: message });
  //   setMessages((messages) => [...messages, userMessage]);

  //   try {
  //     const response = await axios.post("/api/hello", { prompt: message });
  //     const answer = response.data.answer;
  //     const botMessage = new SystemMessage({ role: "system", content: answer });
  //     setMessages((messages) => [...messages, botMessage]);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleInputChange = (e) => {
  //   setInputValue(e.target.value);
  // };

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   if (inputValue.trim() !== "") {
  //     handleUserMessage(inputValue);
  //     setInputValue("");
  //   }
  // };

  // return (
  //   <div>
  //     {messages.map((message, index) => (
  //       <div key={index}>
  //         {message.role === "system" ? (
  //           <p>{message.content}</p>
  //         ) : (
  //           <p>
  //             <strong>User:</strong> {message.content}
  //           </p>
  //         )}
  //       </div>
  //     ))}
  //     <form onSubmit={handleSubmit}>
  //       <input type="text" value={input} onChange={handleInputChange} />
  //       <button type="submit">Send</button>
  //     </form>
  //   </div>
  // );

const { messages, input, handleInputChange, handleSubmit, data } = useChat();
console.log({messages,input,handleInputChange,handleSubmit,data})

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.length > 0
        ? messages.map(m => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === 'user' ? 'User: ' : 'AI: '}
              {m.content}
            </div>
          ))
        : null}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
};

export default function Home() {
  return (
    <>
      {/* <Head>
        Head content
      </Head> */}
      <main>
        {/* Other content */}
        <ChatUI />
      </main>
    </>
  );
}