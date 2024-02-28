// --------------- ELEMENTS --------------- //

const login = document.querySelector(".login");
const loginForm = document.querySelector(".login-form");
const loginInput = document.getElementById("name");

const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat-form");
const chatInput = document.getElementById("name");

// --------------- CONSTANTS --------------- //

const user = {
  id: "",
  name: "",
  color: ""
};

const randomColors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

let websocket;

// --------------- EVENTS --------------- //

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const ramdomUser = `Usuário ${Math.ceil(Math.random() * 1000)}`;
  const formatName = loginInput.value.trim();

  user.name = formatName;
  user.id = crypto.randomUUID();
  user.color = getRandomColor();

  login.style.display = 'none';
  chat.style.display = 'flex';

  websocket = new WebSocket('ws:localhost:8080');
});

chatForm.addEventListener("submit", (event) => {

})

// --------------- FUNCTIONS --------------- //

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * randomColors.length);
  return randomColors[randomIndex];
}
