// --------------- ELEMENTS --------------- //

const banner = document.querySelector(".banner");
const container = document.querySelector(".container");

const login = document.querySelector(".login");
const loginForm = document.querySelector(".login-form");
const inputName = document.getElementById("name");
const inputGender = document.getElementById("gender");

const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat-form");
const chatInput = document.querySelector(".chat-textarea");
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
    alert(
      "Conectando... espere por alguns instantes. Tempo de espera máximo: 30 segundos."
    );
  }

  if (websocket.readyState === 1) {
    websocket.send(JSON.stringify(message));
  }
}

function connectWebSocket() {
  // websocket = new WebSocket("wss://ephemeral-service.onrender.com");
  websocket = new WebSocket("ws://localhost:7070");

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
