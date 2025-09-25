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

export async function generate(userMessage) {
  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant who answers the asked questions. You can use tools when helpful.
         Tool: webSearch({query: string}) for latest info.
         Current date and time: ${new Date().toUTCString()}`,
    },
  ];

  messages.push({ role: "user", content: userMessage });

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
      return completion.choices[0].message.content;
    }

    for (const tool of toolCalls) {
      const functionName = tool.function.name;
      const functionParams = tool.function.arguments;

      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionParams));

        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }
  }
}
