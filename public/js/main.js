const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// get username and room url
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const socket = io();

// Join chatroom
socket.emit("joinroom", { username, room });

// get room and users
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// message from server
socket.on("message", (message) => {
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // Emit msg to server
    socket.emit("chatMessage", msg);

    // clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    chatMessages.appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}