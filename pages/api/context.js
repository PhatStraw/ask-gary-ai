import { VercelPostgres } from "langchain/vectorstores/vercel_postgres";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export default async function handler(req, res) {
  try {
    const vercelPostgresStore = await VercelPostgres.initialize(
      new OpenAIEmbeddings({
        openAIApiKey: process.env.NEXT_OPENAI_API_KEY
      }),
      {
        postgresConnectionOptions: {
          connectionString: process.env.NEXT_POSTGRES_URL,
        },
      }
    );

    const { query } = req.body;
    const results = await vercelPostgresStore.similaritySearch(query, 5);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}