require('dotenv').config()
const { YoutubeLoader } = require("langchain/document_loaders/web/youtube");
const { TextSplitter } = require("langchain/text_splitter");
const { CharacterTextSplitter } = require('langchain/text_splitter')
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { VercelPostgres } = require("langchain/vectorstores/vercel_postgres");
const { google } = require('googleapis');

const channelId = 'UCIBgYfDjtWlbJhg--Z4sOgQ'; // Replace with the desired creator's ID

const config = {
  postgresConnectionOptions: {
    connectionString: process.env.NEXT_POSTGRES_URL
  },
};

// Function to get all video URLs from a specific creator
async function getVideoUrlsFromCreator(channelId) {
  // Set up the YouTube Data API client
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.NEXT_YOUTUBE_DATA_API, // Replace with your own API key
  });
  try {
    // Get all videos from the channel
    const videosResponse = await youtube.search.list({
      part: 'id',
      channelId: channelId,
      maxResults: 50, // Adjust the number of results as needed
    });
    const videoUrls = videosResponse.data.items.map((item) => `https://www.youtube.com/watch?v=${item.id.videoId}`);

    return videoUrls;
  } catch (error) {
    console.error('Error retrieving video URLs:', error);
    return [];
  }
}

// Function to create loaders from given urls
const getLoaders = async (youtubeUrls) => {
  return youtubeUrls.map((url) => {
    try {
      return YoutubeLoader.createFromUrl(url, {
        language: 'en',
        addVideoInfo: true,
      });
    } catch (error) {
      console.error('Error creating YoutubeLoader:', error);
      return undefined; // Ignore the entry and continue with the next one
    }
  }).filter((loader) => loader !== undefined);
}

//Transcribe and chunk loaders
const loadnSplitDocuments = async (loaders) => {
  return await Promise.all(loaders.map(async (loader) => {
    try {
      return await loader.loadAndSplit(
        new CharacterTextSplitter({
          separator: ' ',
          chunkSize: 2500,
          chunkOverlap: 200,
        })
      );
    } catch (error) {
      console.error('Error creating YoutubeLoader:', error);
      return undefined; // Ignore the entry and continue with the next one
    }
  }).filter((doc) => doc !== undefined))
}

(async () => {
  const vercelPostgresStore = await VercelPostgres.initialize(
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    }),
    config
  );
  
  const youtubeUrls = await getVideoUrlsFromCreator(channelId);
  const loaders = await getLoaders(youtubeUrls)
  const documents = await loadnSplitDocuments(loaders)

  await Promise.all(documents.map(async (doc) => {
    if (doc) return await vercelPostgresStore.addDocuments(doc)
    return
  }))

  const results = await vercelPostgresStore.similaritySearch("Where does Garry work?", 2);

  console.log("result", results[0]);
  process.exit();
})()