'use client';
import { useChat } from 'ai/react';
import { IconArrowRight, IconSearch } from "@tabler/icons-react";

const ChatUI = () => {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();

  return (
    <div className="flex flex-col w-full mx-auto max-w-[730px] p-2">
      <form onSubmit={handleSubmit}>
        <div className="relative w-full mt-4">
          <IconSearch className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />
          <input
            className="h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
            type="text"
            value={input}
            placeholder="How do I know if ive found a product/market fit?"
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
      <section className='pt-3'>
        {messages.length > 0 && messages[messages.length -1].role !== 'user'  ? (
          <div key={messages[messages.length -1].id} className="whitespace-pre-wrap">
            <h3 className='text-3xl'> {messages[messages.length -1].role === 'user' ? 'User ' : 'Answer '}</h3>
            <p className='p-2 text-xl'>{messages[messages.length -1].content}</p>
          </div>
        )
          : null}
      </section>
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