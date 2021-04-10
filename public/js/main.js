const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room })

socket.on('message', message => {
  console.log(message);
  appendMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', event => {
  event.preventDefault();

  const input = event.target.elements.msg;

  const message = input.value;
  socket.emit('chatMessage', message);

  // Clear input
  input.value = '';
  input.focus();
});

const appendMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
  <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>
  `;

  document.querySelector('.chat-messages').appendChild(div);
};