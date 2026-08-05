function reply() {

  let msg = document.getElementById("msg");
  let chat = document.getElementById("chatBox");

  let text = msg.value.trim();

  if (text === "") return;

  // User Message
  chat.innerHTML += `
    <div class="user">
      🧑 ${text}
    </div>
  `;

  msg.value = "";

  // Auto Scroll
  chat.scrollTop = chat.scrollHeight;

  let ans = "😊 Main abhi seekh rahi hoon.";

  let t = text.toLowerCase();

  if (t.includes("hi") || t.includes("hello")) {
    ans = "👋 Hi Asfak! Main Ayra hoon ❤️";
  }
  else if (t.includes("kaise ho")) {
    ans = "😊 Main bilkul theek hoon. Tum kaise ho?";
  }
  else if (t.includes("tumhe kisne banaya")) {
    ans = "💜 Mujhe Asfak ne banaya hai.";
  }
  else if (t.includes("bye")) {
    ans = "👋 Bye Asfak! Jaldi milte hain.";
  }

  // Typing...
  setTimeout(function () {

    chat.innerHTML += `
      <div class="bot">
        ${ans}
      </div>
    `;

    chat.scrollTop = chat.scrollHeight;

  }, 700);

}

// Enter Key Support
document.getElementById("msg").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    reply();
  }
});