// --------------- ELEMENTS --------------- //

const login = document.querySelector(".login");
const loginForm = document.querySelector(".login-form");
const loginInput = document.getElementById("name");

const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat-form");
const chatInput = document.querySelector(".chat-input");
const chatMessages = document.querySelector(".chat-messages");

// --------------- CONSTANTS --------------- //

let websocket;

const user = {
  id: "",
  name: "",
  color: "",
};

const randomColors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

// --------------- EVENTS --------------- //

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formatName = loginInput.value.trim();

  user.name = formatName;
  user.id = crypto.randomUUID();
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

   // Open connection?
  if (!websocket || websocket.readyState === WebSocket.CLOSED) {
    websocket = new WebSocket("wss://ephemeral-service.vercel.app");
    websocket.onmessage = processMessageClient;
  }
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessageSocket();
  chatInput.value = "";
});

// --------------- FUNCTIONS --------------- //

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * randomColors.length);
  return randomColors[randomIndex];
}

function scrollScreenBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function processMessageClient({ data }) {
  const { userId, userName, userColor, content } = JSON.parse(data);

  const messageType =
    userId === user.id
      ? createMessageElementSelf(content)
      : createMessageElementOther(userName, userColor, content);

  chatMessages.appendChild(messageType);
  scrollScreenBottom();
}

function sendMessageSocket() {
  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };

  websocket.send(JSON.stringify(message));
  // websocket.close();
}

function createMessageElementSelf(content) {
  const newElement = document.createElement("div");
  newElement.textContent = content;
  newElement.classList.add("message-self");

  return newElement;
}

function createMessageElementOther(userName, userColor, content) {
  console.log({ userName, userColor, content });
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message-self");
  div.classList.add("message-other");
  span.classList.add("message-other-sender");

  div.appendChild(span);

  span.innerHTML = userName;
  span.style.color = userColor;

  div.innerHTML += content;

  return div;
}
