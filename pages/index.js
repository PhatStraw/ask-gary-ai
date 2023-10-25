import 'dotenv/config'
import { HumanMessage, SystemMessage } from "langchain/schema";
import axios from "axios";
import { useState } from "react";
import Head from "next/head";
const ChatUI = () => {
  const [messages, setMessages] = useState([
    new SystemMessage({ role: "system", content: "Welcome to the ChatGPT Chat UI!" }),
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleUserMessage = async (message) => {
    const userMessage = new HumanMessage({ role: "user", content: message });
    setMessages((messages) => [...messages, userMessage]);

    try {
      const response = await axios.post("/api/hello", { prompt: message });
      const answer = response.data.answer;
      const botMessage = new SystemMessage({ role: "system", content: answer });
      setMessages((messages) => [...messages, botMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      handleUserMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          {message.role === "system" ? (
            <p>{message.content}</p>
          ) : (
            <p>
              <strong>User:</strong> {message.content}
            </p>
          )}
        </div>
      ))}
      <form onSubmit={handleFormSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">Send</button>
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