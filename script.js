async function reply() {
  const msg = document.getElementById("msg");
  const chat = document.getElementById("chatBox");

  const text = msg.value.trim();

  if (text === "") return;

  chat.innerHTML += `
    <div class="user">
      🧑 ${escapeHtml(text)}
    </div>
  `;

  msg.value = "";
  chat.scrollTop = chat.scrollHeight;

  const typing = document.createElement("div");
  typing.className = "bot";
  typing.innerHTML = "👧 Ayra is thinking...";

  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const raw = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", raw);

    typing.remove();

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      data = { error: raw };
    }

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    chat.innerHTML += `
      <div class="bot">
        👧 ${escapeHtml(data.reply || "No reply received")}
      </div>
    `;

  } catch (error) {
    typing.remove();

    chat.innerHTML += `
      <div class="bot">
        👧 ❌ Error:<br>
        ${escapeHtml(error.message)}
      </div>
    `;

    console.error("Ayra Error:", error);
  }

  chat.scrollTop = chat.scrollHeight;
}


document.getElementById("msg").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    reply();
  }
});


function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
        }
