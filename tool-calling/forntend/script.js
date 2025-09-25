const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask-btn");

input.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleAsk);

async function generate(text) {
  const message = document.createElement("div");
  message.className = `my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit`;
  message.textContent = text;
  chatContainer.appendChild(message);
  input.value = "";

  console.log("User:", text);
  // call server
  const assistantMessage = await callServer(text);

  console.log("Assistant:", assistantMessage);
}

async function callServer(inputText) {
  const res = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ message: inputText }),
  });

  if (!res.ok) {
    console.error("Error calling server:");
  }

  const result = await res.json();
  return result.msg;
}

async function handleAsk(e) {
  const text = input.value.trim();

  if (!text) return;

  await generate(text);
}

async function handleEnter(e) {
  if (e.key === "Enter") {
    const text = input.value.trim();

    if (!text) return;

    await generate(text);
  }
}
