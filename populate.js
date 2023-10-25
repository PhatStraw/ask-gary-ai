require('dotenv').config()
const { YoutubeLoader } = require("langchain/document_loaders/web/youtube");
const { TextSplitter } = require("langchain/text_splitter");
const { CharacterTextSplitter } = require('langchain/text_splitter')
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { VercelPostgres } = require("langchain/vectorstores/vercel_postgres");
const { google } = require('googleapis');



const start = async () => {
  // Set up the YouTube Data API client
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.NEXT_YOUTUBE_DATA_API, // Replace with your own API key
  });

  // Function to get all video URLs from a specific creator
  async function getVideoUrlsFromCreator(channelId) {
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
  // Usage example
  const channelId = 'UCIBgYfDjtWlbJhg--Z4sOgQ'; // Replace with the desired creator's username
  const youtubeUrls = await getVideoUrlsFromCreator(channelId);
  // console.log("YOUTUBE URLS: ", youtubeUrls)
  // Config is only required if you want to override default values.
  const config = {
    // tableName: "testvercelvectorstorelangchain",
    postgresConnectionOptions: {
      connectionString: process.env.NEXT_POSTGRES_URL
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


  const loaders = youtubeUrls.map((url) => {
    try {
      const hello = YoutubeLoader.createFromUrl(url, {
        language: 'en',
        addVideoInfo: true,
      });
      return hello;
    } catch (error) {
      console.error('Error creating YoutubeLoader:', error);
      return undefined; // Ignore the entry and continue with the next one
    }
  }).filter((loader) => loader !== undefined);

  
  const documents = await Promise.all(loaders.map(async (loader) => {
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

  const ids = await Promise.all(documents.map(async (doc)=>{
    if(doc) return await vercelPostgresStore.addDocuments(doc)
    return 
  }))

  const results = await vercelPostgresStore.similaritySearch("Where does Garry work?", 2);
  console.log("result",results[0].metadata);
  process.exit();
}

start()