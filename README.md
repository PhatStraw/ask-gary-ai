# Garry Tan AI

[https://ask-g-pt-ai.vercel.app/](https://ask-g-pt-ai.vercel.app/)

Perform semantic search and ChatGPT chat operations based on the YouTube videos of Garry Tan.

## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Configure environment variables in a `.env` file. 

## Usage

To start the application, run `npm start` and navigate to [http://localhost:3000](http://localhost:3000) in your browser. Enter messages in the input field and press enter to interact with the chatbot.

## Documentation

For more information on how to use the ChatGPT API, please refer to [https://platform.openai.com/overview](https://platform.openai.com/overview).

## Contributing

Contributions to this project are welcome. Please follow the contribution guidelines when making contributions.

License

This project is licensed under the MIT License.

## Dataset

The dataset used for this project is a vector store of YouTube video transcripts from Garry Tan. It contains text and embeddings for semantic search and chat operations.

## How It Works

The Garry Tan AI provides two main functionalities:

1. Semantic Search: The search interface uses OpenAI Embeddings to generate embeddings for each chunk of text in the dataset. It then compares the user's search query embedding with the embeddings in the dataset to find the most similar passages. The results are ranked by similarity score and returned to the user.

2. Chat: The chat interface builds on top of the search functionality. It uses the search results to create a prompt that is fed into GPT-3.5-turbo for generating responses to user questions.

## Running Locally

To run the Garry Tan AI locally, follow these steps:

1. Set up OpenAI: Obtain an OpenAI API key to generate embeddings.

2. Set up a database: You can use any method to store your data, but the recommended approach is to use Supabase. Set up a Supabase database and enable Row Level Security. Create a service role to use with the app.

3. Clone the repository: `git clone https://github.com/PhatStraw/ask-gary-ai`

4. Install dependencies: `npm install`

5. Set up environment variables: Create a `.env.local` file in the root of the repository and add the following variables:
   - POSTGRES_URL
   - POSTGRES_PRISMA_URL
   - POSTGRES_URL_NON_POOLING
   - POSTGRES_USER
   - POSTGRES_HOST
   - POSTGRES_PASSWORD
   - POSTGRES_DATABASE
   - YOUTUBE_DATA_API
   - OPENAI_API_KEY

6.  `node populate`: This will scrape the YouTube video transcripts from Garry Tan and save them to a vector db. This will generate embeddings for each chunk of text in the JSON file and save them to your database. Note that there is a delay between each request to avoid rate limiting.

8. Run the app: `npm run dev`

Credits

Thanks to Garry Tan for his YouTube videos.

Contact: If you have any questions, feel free to reach out to me on Twitter!

Note: The app's code structure prioritizes simplicity over composability.