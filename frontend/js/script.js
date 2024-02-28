const login = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const loginInput = document.querySelector('.login-input');

const user = {
    id: "",
    name: "",
    color: "",
    sessionId: ""
}


loginInput.addEventListener('submit', (event) => {
    event.preventDefault();
    user.name = loginInput.value;
    event.value = '';
    console.log(loginInput.value)
})

console.log(user)
