import readline from 'node:readline/promises';
import Groq from "groq-sdk/index.mjs";
import env from "dotenv";
import { tavily } from "@tavily/core";

env.config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function webSearch({ query }) {
  console.log("Searching the web...");

  const response = await tvly.search(query);
  // console.log("Response: ", response);

  const finalResponse = response.results
    .map((result) => result.content)
    .join("\n\n");

  return finalResponse;
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const messages = [
    {
      role: "system",
      content:
        "You are a smart personal assistant who answers the asked questions. You can use tools when helpful. Tool: webSearch({query: string}) for latest info.",
    },
    // { role: "user", content: "What is the current weather in pune" },
  ];

  while(true) {
    const question = await rl.question('Enter your question: '); 
    if(question === 'bye') {  
      break;
    }

    messages.push({ role: "user", content: question });

    while (true) {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the latest information and realtime data on the web",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to perform search",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    messages.push(completion.choices[0].message);
    const toolCalls = completion.choices[0].message.tool_calls;

    if (!toolCalls) {
      console.log(`Assistant result: ${JSON.stringify(completion.choices[0].message.content, null, 2) }`);
      break;
    }

    for (const tool of toolCalls) {
      // console.log(`Tool: `, tool);

      const functionName = tool.function.name;
      const functionParams = tool.function.arguments;

      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionParams));
        // console.log("Tool result: ", toolResult);

        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }

    // console.log(
    //   "result :",
    //   JSON.stringify(completion.choices[0].message, null, 2)
    // );
  }
  }

  rl.close()
}

main();
