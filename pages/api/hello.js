import 'dotenv/config';
import OpenAI from 'openai';
import { VercelPostgres } from "langchain/vectorstores/vercel_postgres";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const runtime = 'edge';

const config = {
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
};


const vercelPostgresStore = await VercelPostgres.initialize(
  new OpenAIEmbeddings({
    openAIApiKey: process.env.NEXT_OPENAI_API_KEY
  }),
  config
);

const openai = new OpenAI({
  openAIApiKey: process.env.NEXT_OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    try {
      const results = await vercelPostgresStore.similaritySearch(prompt, 3);

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        temperature: 0,
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant' },
          {
            role: 'user',
            content: `Answer the following question using the provided 
                context. If you cannot answer the question with the context, 
                don't lie and make up stuff. Just say you need more context.
                    Question: ${prompt}
                    Context: ${results.map((r) => r.pageContent).join('\n')}`,
          }
        ]
      })

      res.status(200).json({
        answer: `Answer: ${response.choices[0].message.content}\nSources: ${results.map((r) => r.metadata.source).join(', ')}` 
      });
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}