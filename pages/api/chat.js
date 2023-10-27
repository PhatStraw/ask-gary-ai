
import { NextResponse } from "next/server";
import { VercelPostgres } from "langchain/vectorstores/vercel_postgres";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';


const openai = new OpenAI({
  openAIApiKey: process.env.NEXT_OPENAI_API_KEY
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export default async function handler(req) {
  const vercelPostgresStore = await VercelPostgres.initialize(
    new OpenAIEmbeddings({
      openAIApiKey: process.env.NEXT_OPENAI_API_KEY
    }),
    {
      // tableName: "testvercelvectorstorelangchain",
      postgresConnectionOptions: {
        connectionString: process.env.NEXT_POSTGRES_URL,
      },
      // columns: {
      //   idColumnName: "id",
      //   vectorColumnName: "vector",
      //   contentColumnName: "content",
      //   metadataColumnName: "metadata",
      // },
    }
  );
  if (req.method === "POST") {
    const { messages, body } = await req.json();
    console.log(body)
    try {
      const results = await vercelPostgresStore.similaritySearch(messages[messages.length - 1].content, 1);
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        stream: true,
        messages: [
          {
            role: 'system',
            content: `You are a AI Assistant`
          },
          {
            role: 'user',
            content: `
              Use the following context to provide an answer to the question:

              Question: ${messages[messages.length - 1].content}

              Context: ${results.map((r) => r.pageContent).join('\n')}`,
          }
        ]
      })

      // Convert the response into a friendly text-stream
      const stream = OpenAIStream(response);
      // Respond with the stream
      return new StreamingTextResponse(stream);
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}