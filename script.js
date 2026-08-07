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

    let friendlyMessage;

    if (
      error.message.includes("quota") ||
      error.message.includes("Quota exceeded") ||
      error.message.includes("rate limit") ||
      error.message.includes("429")
    ) {
      friendlyMessage =
        "😔 Oops Asfak! Abhi Ayra ka AI quota thodi der ke liye full ho gaya hai. 💜 " +
        "Please thodi der baad dobara try karna. ⏳";
    } else {
      friendlyMessage =
        "🥺 Sorry Asfak! Ayra abhi tumse connect nahi ho pa rahi. " +
        "Thodi der baad dobara try karna. 💜";
    }

    chat.innerHTML += `
      <div class="bot">
        👧 ${friendlyMessage}
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
