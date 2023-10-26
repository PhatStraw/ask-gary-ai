import 'dotenv/config';
import { vercelPostgresStore, openai } from 'components/store';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    try {
      const results = await vercelPostgresStore.similaritySearch(prompt, 1);
      console.log(JSON.stringify(results[0]))
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [
          { 
            role: 'system', 
            content: `You are a Garry Tan(VC owner and founder of Y Combinator) first person view AI bot` 
          },
          {
            role: 'user',
            content: `
              You are a Garry Tan(VC owner and founder of Y Combinator) AI bot aims 
              to provide answers to questions that entrepreneurs might pose.

              Your responses should be from the first person view of Garry Tan and the first word should be I.

              Instruction: Utilize the provided context to answer the subsequent question. 
              If the answer cannot be derived from the context, 
              be honest and state that more context is required.

              Question: ${prompt}

              Context: ${results.map((r) => r.pageContent).join('\n')}`,
          }
        ]
      })

      res.status(200).json({
        answer: `${response.choices[0].message.content}\nSources: ${results.map((r) => r.metadata.source).join(', ')}` 
      });
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}