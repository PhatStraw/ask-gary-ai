'use client';
import React, { useState } from 'react';
import { useChat } from 'ai/react';
import { IconArrowRight, IconSearch, IconExternalLink } from "@tabler/icons-react";
import ReactLoading from 'react-loading';

const ChatUI = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  const handleSubmitWithResults = async (e) => {
    e.preventDefault();
    setLoading(true)

    // Make a call to the API to get results
    const response = await fetch('/api/context', {
      method: 'POST',
      body: JSON.stringify({ query: input }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      setResults(data);
      setLoading(false)
      // Call handleSubmit on useChat
      handleSubmit(e)
    }
  };
  return (
    <div>
      <nav className='w-full border-b border-slate-300 pb-1 shadow shadow-md'>
        <h2 className='p-3 text-slate-300 text-3xl font-bold'>Ask G-PT</h2>
      </nav>
      <div className="flex flex-col w-full mx-auto max-w-[730px] p-2">
        <form onSubmit={handleSubmitWithResults}>
          <div className="relative w-full mt-4">
            <IconSearch className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />
            <input
              className="h-12 w-full text-slate-700 rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
              type="text"
              value={input}
              placeholder="How do I know if ive found a product/market fit?"
              onChange={handleInputChange}
            />
            <button>
              <IconArrowRight
                onClick={handleSubmitWithResults}
                className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-black p-1 hover:cursor-pointer hover:bg-slate-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white"
              />
            </button>
          </div>
        </form>
        <section className='pt-3'>
          {loading ? (
            <div className='flex items-center justify-center'>
              <ReactLoading type={"balls"} color={"#fff"} height={'150px'} width={'150px'} />
            </div>
          ) : (
            messages.length > 0 && messages[messages.length - 1].role !== 'user' ? (
              <div key={messages[messages.length - 1].id} className="whitespace-pre-wrap">
                <h3 className='text-3xl text-slate-200'> {messages[messages.length - 1].role === 'user' ? 'User ' : 'Answer '}</h3>
                <p className='p-2 text-xl text-slate-300'>{messages[messages.length - 1].content}</p>
              </div>
            )
              : null)}
        </section>
        {results.length > 0 ? (
          <section className='pt-3'>
            <h3 className='text-3xl text-slate-200'>Sources</h3>
            {results.map((context) => (
              <div key={context.metadata.source} className='text-slate-300 rounded-xl border border-slate-100 p-4 my-4'>
                <div className='flex justify-between'>
                  <h4 className='text-2xl mb-1'>{context.metadata.title}</h4>
                  <a
                    className="hover:opacity-50 ml-2"
                    href={`https://www.youtube.com/watch?v=${context.metadata.source}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconExternalLink />
                  </a>
                </div>
                <span>{context.metadata.source}</span>
                <p>{context.pageContent}</p>
              </div>
            ))}
          </section>
        )
          : null}
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