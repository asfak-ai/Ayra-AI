async function reply() {

  const msg = document.getElementById("msg");
  const chat = document.getElementById("chatBox");

  const text = msg.value.trim();

  if (text === "") return;

  // User message
  chat.innerHTML += `
    <div class="user">
      🧑 ${escapeHtml(text)}
    </div>
  `;

  msg.value = "";
  chat.scrollTop = chat.scrollHeight;

  // Typing message
  const typing = document.createElement("div");
  typing.className = "bot";
  typing.id = "typing";
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

    const data = await response.json();

    typing.remove();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    chat.innerHTML += `
      <div class="bot">
        👧 ${escapeHtml(data.reply)}
      </div>
    `;

  } catch (error) {

    typing.remove();

    chat.innerHTML += `
      <div class="bot">
        👧 Sorry Asfak 😔<br>
        Abhi AI se connection nahi ho pa raha.
      </div>
    `;

    console.error(error);
  }

  chat.scrollTop = chat.scrollHeight;
}


// Enter key support
document.getElementById("msg").addEventListener("keypress", function(e) {

  if (e.key === "Enter") {
    reply();
  }

});


// Security: HTML ko message ke andar execute hone se rokta hai
function escapeHtml(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}