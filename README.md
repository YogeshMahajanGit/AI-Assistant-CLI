🧠 AI Personal Assistant CLI

A simple Node.js CLI chatbot powered by Groq LLM & Cerebras Cloud LLM and Tavily Web Search API.
It can answer your questions, search the web for the latest information, and act like a smart personal assistant — all from your terminal.

🚀 Features

Added a Chatbot interface(frontend)

<!-- Interactive CLI chatbot (type your questions in the terminal). -->

Powered by Groq LLaMA-3.3-70B for intelligent responses.

Integrated with Tavily API for real-time web search.

Node cache for memory

Auto-handles both LLM replies and tool calls.

Minimal and lightweight — just Node.js + APIs.

📸 Demo
Start the assistant

Ask a question

Web search in action

(You can replace these with real screenshots or a short GIF recording of the terminal using ScreenToGif
or asciinema
).

📦 Installation

Clone the repo:

git clone https://github.com/your-username/ai-personal-assistant-cli.git
cd ai-personal-assistant-cli

Install dependencies:

npm install

Create a .env file in the project root:

GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key

▶️ Usage

Run the chatbot:

npm start

Example interaction:

Enter your question: what is current date
Searching the web...
Response: ...
Assistant result: Today is September 5, 2025

Type bye to exit:

Enter your question: bye

🛠 Tech Stack

Node.js (CLI interface)

Groq SDK (LLM completions)

Tavily API (web search)

dotenv (environment variables)

📂 Project Structure
.
├── index.js # Main CLI assistant
├── package.json # Project dependencies
├── .env # API keys (not committed)
├── assets/ # Screenshots & GIFs for README
└── README.md # Documentation

🔑 Environment Variables

You must define the following in .env:

GROQ_API_KEY → Groq API key

TAVILY_API_KEY → Tavily API key

🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.
