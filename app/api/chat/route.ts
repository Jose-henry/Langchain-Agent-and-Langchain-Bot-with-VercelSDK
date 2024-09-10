import { ChatOpenAI } from '@langchain/openai';
import { LangChainAdapter, Message } from 'ai';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
  }: {
    messages: Message[];
  } = await req.json();

  const model = new ChatOpenAI({
    model: 'gpt-3.5-turbo-0125',
    temperature: 0,
  });

  const stream = await model.stream(
    messages.map(message =>
      message.role == 'user'
        ? new HumanMessage(message.content)
        : new AIMessage(message.content),
    ),
  );

  return LangChainAdapter.toDataStreamResponse(stream);
}



/* 

import { streamText, Message } from 'ai';
import { DynamicTool, DynamicStructuredTool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIToolsAgent, createOpenAIFunctionsAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import * as hub from "langchain/hub";

import * as z from "zod"


export const runtime = 'edge'


export async function POST(req: Request) {
  const {
    messages,
  }: {
    messages: Message[];
  } = await req.json();

  // initiaize the model
  const model = new ChatOpenAI({
    model: 'gpt-4o', //gpt-3.5-turbo-0125
    temperature: 0,
  });
  // set up a wikipedia query tool for fetching relevant information
  const wikipediaQuery = new WikipediaQueryRun({
    topKResults: 1,
    maxDocContentLength: 400,
  });

  // define a tool named foo that returns the answer to what foo is
  const foo = new DynamicTool({
    name: "foo",
    description: "returen the answer to what foo is",
    func: async () => {
      console.log("returns the answer to what foo is");
      return "foo is me learning about langchain";
    },
  });

   // 8. Define a structured tool to fetch cryptocurrency prices from CoinGecko API
   const fetchCryptoPrice = new DynamicStructuredTool({
    name: 'fetchCryptoPrice',
    description: 'Fetches the current price of a specified cryptocurrency',
    schema: z.object({
      cryptoName: z.string(),
      vsCurrency: z.string().optional().default('USD'),
    }),
    func: async (options) => {
      console.log('Triggered fetchCryptoPrice function with options: ', options);
      const { cryptoName, vsCurrency } = options;
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoName}&vs_currencies=${vsCurrency}`;
      const response = await fetch(url);
      const data = await response.json();
      return data[cryptoName.toLowerCase()][vsCurrency.toLowerCase()].toString();
    },
  });

  // 9. List all the tools that will be used by the agent during execution
  const tools = [wikipediaQuery, foo, fetchCryptoPrice];


  const prompt =  await pull<ChatPromptTemplate>(
    "hwchase17/openai-functions-agent"
  );

  // 10. Initialize the agent executor, which will use the specified tools and model to process input
  const executor = await createOpenAIFunctionsAgent({
    model,
    tool,
    prompt,
  });

  // 11. Extract the most recent input message from the array of messages
  const input = messages[messages.length - 1].content;

  // 12. Execute the agent with the provided input to get a response
  const result = await executor.run(input);

  // 13. Break the result into individual word chunks for streaming
  const chunks = result.split(" ");

  // 14. Define the streaming mechanism to send chunks of data to the client
  const responseStream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        const bytes = new TextEncoder().encode(chunk + " ");
        controller.enqueue(bytes);
        await new Promise((r) => setTimeout(r, Math.floor(Math.random() * 20 + 10)));
      }
      controller.close();
    },
  });

  // 15. Send the created stream as a response to the client
  return new streamText.toDataStreamResponse(responseStream);

}
 */