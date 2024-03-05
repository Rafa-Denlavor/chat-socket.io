// --------------- ELEMENTS --------------- //

const banner = document.querySelector(".coockie-banner");
const container = document.querySelector(".container");

const login = document.querySelector(".login");
const loginForm = document.querySelector(".login-form");
const inputName = document.getElementById("name");
const inputGender = document.getElementById("gender");

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
  gender: "",
};

const genderOptions = {
  M: "female",
  H: "male",
  T: "transgender",
  OTHER: "psychology_alt",
  "N/A": "psychology_alt",
};

// --------------- EVENTS --------------- //

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formatName = inputName.value.trim();

  console.log(inputGender.value);

  user.name = formatName;
  user.id = crypto.randomUUID();
  user.color = getRandomColor();
  user.gender = inputGender.value;

  login.style.display = "none";

  setTimeout(() => {
    const image = document.createElement("img");
    image.src = "./images/loading.gif";
    image.style.width = "400px";
    container.appendChild(image);

    setTimeout(() => {
      container.removeChild(image);

      chat.style.display = "flex";
      banner.style.display = "flex";
    }, 1700);
  }, 0);

  connectWebSocket();
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessageSocket();
  chatInput.value = "";
});

// --------------- FUNCTIONS --------------- //

function processMessageClient({ data }) {
  console.log("[WebSocket] Mensagem recebida do servidor.");
  const { userId, userName, userColor, userGender, content } = JSON.parse(data);

  const messageType =
    userId === user.id
      ? createMessageElementSelf(content)
      : createMessageElementOther(userName, userColor, userGender, content);

  chatMessages.appendChild(messageType);
  scrollScreenBottom();
}

function sendMessageSocket() {
  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    userGender: user.gender,
    content: chatInput.value,
  };

  if (websocket.readyState === 0) {
    alert("Conectando... espere por alguns instantes.");
  }

  if (websocket.readyState === 1) {
    websocket.send(JSON.stringify(message));
  }
}

function createMessageElementSelf(content) {
  const div = document.createElement("div");
  const pre = document.createElement("pre");
  const p = document.createElement("p");

  div.classList.add("message-self");

  div.appendChild(pre);
  div.appendChild(p);

  pre.innerHTML += content;
  p.innerHTML = getHoursAndMinutes();

  return div;
}

function createMessageElementOther(userName, userColor, userGender, content) {
  console.log({ userName, userColor, content });
  const div = document.createElement("div");
  const span = document.createElement("span");
  const spanIcon = document.createElement("span");
  const pre = document.createElement("pre");
  const p = document.createElement("p");

  div.classList.add("message-self");
  div.classList.add("message-other");
  span.classList.add("message-other-sender");

  div.appendChild(span);
  div.appendChild(spanIcon);
  div.appendChild(pre);
  div.appendChild(p);

  span.innerHTML = userName;
  span.style.color = userColor;
  spanIcon.classList.add("material-symbols-outlined");
  spanIcon.innerHTML = genderOptions[userGender];

  pre.innerHTML += content;
  p.innerHTML = getHoursAndMinutes();

  return div;
}

function connectWebSocket() {
  websocket = new WebSocket("wss://ephemeral-service.onrender.com");

  websocket.onopen = (event) => {
    console.log("[WebSocket] Conexão estabelecida com o servidor.");
  };

  websocket.onmessage = processMessageClient;

  websocket.onclose = (event) => {
    console.warn("[WebSocket] Conexão fechada. Reconectando...");

    setTimeout(connectWebSocket, 2000);
  };

  websocket.onerror = (error) => {
    console.error("[WebSocket] Erro: ", { error });
  };
}
