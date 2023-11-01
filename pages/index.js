"use client";
import React, { useEffect, useState } from "react";
import { useChat } from "ai/react";
import Search from "../components/Search";
import LoadingComp from "components/components/Loading";
import Stateless from "components/components/Stateless";
import ChatResponse from "components/components/ChatResponse";
const ChatUI = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
console.log(isLoading)
  const handleSubmitWithResults = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Make a call to the API to get results
    const response = await fetch("/api/context", {
      method: "POST",
      body: JSON.stringify({ query: input }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setResults(data);
      setLoading(false);
      // Call handleSubmit on useChat
      handleSubmit(e);
    }
  };

  return (
    <div>
      <div className="flex flex-col w-full mx-auto max-w-[730px] p-2">
        <Search
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmitWithResults}
          input={input}
        />
        <section className="pt-3">
          {loading ? (
            <LoadingComp />
          ) : messages.length > 0 &&
            messages[messages.length - 1].role !== "user" ? (
            <ChatResponse messages={messages}/>
          ) : isLoading === false && (
            <Stateless message={`Welcome to Garry GPT!<br></br>This platform allows you to dive into the wealth of knowledge available in Garry Tan's YouTube video content, without having to sift through hours of footage. By simply typing in a question, you'll receive insightful information extracted from Garry Tan's videos, alongside a coherent response generated with the help of advanced AI.<br></br>How to Use:<br></br>Enter Your Query: Start by typing your question into the search bar, press enter when ready.<br></br>Explore Further: If interested, you can dive deeper by following the links to the original video content provided alongside the snippets. Your quest for knowledge just got a lot easier and faster with Garry GPT. Now, let's start exploring!`}/>
          )}
        </section>
        {results.length > 0 && (
          <section className="pt-3">
            <h3 className="text-3xl text-slate-200">Sources</h3>
            {results.map((context) => (
              <div
                key={context.metadata.source}
                className="text-slate-300 rounded-xl border border-slate-100 p-4 my-4"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${context.metadata.source}`.replace(
                    "watch?v=",
                    "v/"
                  )}
                  allowFullScreen="1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="w-full aspect-video mb-2 rounded-xl"
                />
                <h3 className="text-xl font-bold mb-1">Context Match</h3>
                <p>{context.pageContent}</p>
              </div>
            ))}
          </section>
        )}
      </div>
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
