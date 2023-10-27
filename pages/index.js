'use client';
import { useChat } from 'ai/react';
import { IconArrowRight, IconExternalLink, IconSearch } from "@tabler/icons-react";

const ChatUI = () => {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();

  return (
    <div className="flex flex-col w-full mx-auto">

      <form onSubmit={handleSubmit}>
        <div className="relative w-full mt-4">
          <IconSearch className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />
          <input
            className="h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
            type="text"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            />
          <button>
            <IconArrowRight
              onClick={handleSubmit}
              className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white"
              />
          </button>
        </div>
      </form>
      <div>
        <h1>Answer</h1>
        {messages.length > 0
          ? messages.map(m => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === 'user' ? 'User: ' : 'AI: '}
              {m.content}
            </div>
          ))
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