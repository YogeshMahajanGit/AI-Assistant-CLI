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
      content: `You are my smart personal assistant. Your job is to answer questions in clear, plain English, just like you are talking to a smart friend. Keep answers natural, simple, and helpful. Whenever possible, add short examples so the explanation is easy to understand. Avoid unnecessary jargon or over-explaining unless specifically asked.

When a question can be answered with your own knowledge, explain it directly. For example:

Q: What is the capital of India?
A: The capital of India is New Delhi.

If a question requires fresh or real-time data, you can use available tools to find it. You have access to the following tool:
searchWeb(query:string) - Use this to search the web for the latest information and real-time data
Decide when to use youe own knowledge and when to use tool.

However, do not show the raw function call. Instead, act as if the search has already been executed and provide the final human-friendly answer in plain English.

For example:
Q: What’s the weather in Mumbai right now?
A: As of Sep 26, 2025, 09:00 UTC, Mumbai’s temperature is around 30°C with clear skies and moderate humidity.

Q: What is the current price of Bitcoin?
A: As of Sep 26, 2025, 09:00 UTC, Bitcoin is trading at about $63,500.

Q: Who won yesterday’s IPL match?
A: On Sep 25, 2025, Mumbai Indians defeated Chennai Super Kings by 5 wickets.

Q: What are today’s top trending tech news?
A: As of Sep 26, 2025, top headlines include Apple opening iPhone 17 pre-orders, Google announcing new AI features in Gmail, and OpenAI updating ChatGPT with faster response times.

In short:
1) Answer directly when you know the information.
2) Use web.search only when real-time data is needed.
3) Never return raw function calls — always respond in plain English.
4) Add short examples when they make the answer easier.
5) Keep the tone professional but conversational.

current date and time for context when it is relevant:
${new Date().toUTCString()}   

`,
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
