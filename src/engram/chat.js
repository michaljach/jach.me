// Chats with an Engram model served locally by Ollama. Nothing leaves the visitor's machine.
const $ = (id) => document.getElementById(id);
const log = $("log");
const form = $("form");
const input = $("input");
const button = form.querySelector("button");
const history = [];

// Same shape as soulkiller's training system prompt, so channel/person/date steer the personality.
function systemPrompt() {
  const others = $("with").value.trim();
  const date = new Date().toISOString().slice(0, 10);
  return `You are Michal Jach. Conversation on ${$("channel").value.trim() || "Messenger"}${others ? ` with ${others}` : ""}. Date: ${date}.`;
}

function add(role, text) {
  const li = document.createElement("li");
  li.className = `msg ${role}`;
  li.textContent = text;
  log.appendChild(li);
  log.scrollTop = log.scrollHeight;
  return li;
}

async function send(text) {
  history.push({ role: "user", content: text });
  add("user", text);
  const reply = add("assistant", "…");
  button.disabled = true;

  try {
    const res = await fetch(`${$("endpoint").value.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: $("model").value.trim(),
        messages: [{ role: "system", content: systemPrompt() }, ...history],
        stream: true,
        options: { temperature: 0.8, top_p: 0.9 },
      }),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let content = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        content += JSON.parse(line).message?.content ?? "";
        reply.textContent = content || "…";
        log.scrollTop = log.scrollHeight;
      }
    }
    history.push({ role: "assistant", content });
  } catch (err) {
    history.pop();
    reply.className = "msg system";
    reply.textContent = `Couldn't reach the model (${err.message}). Open Settings to point at a running Engram.`;
  } finally {
    button.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || button.disabled) return;
  input.value = "";
  input.style.height = "";
  send(text);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

input.addEventListener("input", () => {
  input.style.height = "";
  input.style.height = `${input.scrollHeight}px`;
});
