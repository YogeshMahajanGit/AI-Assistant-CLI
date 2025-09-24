const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask-btn");

input.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleAsk);

function generate(text) {
  const message = document.createElement("div");
  message.className = `my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit`;
  message.textContent = text;
  chatContainer.appendChild(message);
  input.value = "";
}

function handleAsk(e) {
  const text = input.value.trim();

  if (!text) return;

  generate(text);
}

function handleEnter(e) {
  if (e.key === "Enter") {
    const text = input.value.trim();

    if (!text) return;

    generate(text);
  }
}
