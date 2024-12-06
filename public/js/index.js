const socket = io();

// Capturar el botón de enviar y el input del mensaje
const sendButton = document.getElementById("sendButton");
const chatBox = document.getElementById("chatBox");
const messageLogs = document.getElementById("messageLogs");


// Enviar el mensaje cuando el usuario hace clic en el botón
sendButton.addEventListener("click", () => {
  const message = chatBox.value;
  if (message) {
    socket.emit("message", message);
    chatBox.value = "";
  }
});

// Escuchar los mensajes y mostrarlos en el navegador
socket.on("messageLogs", (messages) => {
  messageLogs.innerHTML = messages
    .map((message) => `<p>${message}</p>`)
    .join("");
});
