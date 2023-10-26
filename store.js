import 'dotenv/config';
import { VercelPostgres } from "langchain/vectorstores/vercel_postgres";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import OpenAI from 'openai';

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


export const vercelPostgresStore = await VercelPostgres.initialize(
    new OpenAIEmbeddings({
        openAIApiKey: process.env.NEXT_OPENAI_API_KEY
    }),
    config
);

export const openai = new OpenAI({
    openAIApiKey: process.env.NEXT_OPENAI_API_KEY
});