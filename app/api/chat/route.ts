/* import { ChatOpenAI } from '@langchain/openai';
import { LangChainAdapter, Message } from 'ai';
import { AIMessage, HumanMessage } from 'langchain/schema';

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
 */




import { StreamingTextResponse, Message } from 'ai';
import { DynamicTool, DynamicStructuredTool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';

import { AgentExecutor, createOpenAIToolsAgent, createOpenAIFunctionsAgent } from "langchain/agents";

import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";


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

  // define a structure tool to fetch cryptocurrency prices from CoinGecko API

}
