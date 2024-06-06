const firebaseConfig = {
  apiKey: "AIzaSyAcyqPpPq0dXLez3MINPXfYvy6LnOCkbPM",
  authDomain: "cringechat-cc04f.firebaseapp.com",
  databaseURL: "https://cringechat-cc04f-default-rtdb.firebaseio.com",
  projectId: "cringechat-cc04f",
  storageBucket: "cringechat-cc04f.appspot.com",
  messagingSenderId: "1078798953034",
  appId: "1:1078798953034:web:78081799548359f3e294b3",
  measurementId: "G-FGHETW90V3"
};
firebase.initializeApp(firebaseConfig); 
const db = firebase.database();
console.log(firebase.database());

const username = prompt("What's your name?") || "anonymous"; 
let userColor; // Variable to store user's unique color

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const messageSound = new Audio("aim.mp3"); // Audio object for notification (optional)

document.getElementById("send-message").addEventListener("submit", postChat);
function postChat(e) {
  e.preventDefault();
  const timestamp = Date.now();
  const chatTxt = document.getElementById("chat-txt");
  const message = chatTxt.value;
  chatTxt.value = "";

  if (!userColor) { // Generate color only if not assigned yet
    userColor = getRandomColor();
  }

  // Write message data to Firebase database
  db.ref("messages/" + timestamp).set({
    usr: username,
    msg: message,
    color: userColor // Store user color in the message data
  });
}

// Listen for new messages added to the database (Real-time updates)
const fetchChat = db.ref("messages/"); // Reference the "messages" path
fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const msgElement = createMessageElement(messages.usr, messages.msg, messages.color);
  const chatContainer = document.getElementById("messages");

  // Add new message element to the chat container
  chatContainer.innerHTML += msgElement;

  // Autoscroll to the bottom after adding a new message
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
});

function createMessageElement(username, message, userColor) {
  return `<li>` +
    `<span class="username" style="color: ${userColor}">` + username + "</span>" +
    " : " + message +
    "</li>";
}

// ---
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}
var track = (xx) => {

  var userStatusDatabaseRef = firebase.database().ref('/tempUser/' + xx);

  var isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  var isOnlineForDatabase = {
      state: 'online',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  firebase.database().ref('.info/connected').on('value', function (snapshot) {
      if (snapshot.val() == false) {
          return;
      };

      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
          userStatusDatabaseRef.set(isOnlineForDatabase);
      });
  });
  checkOnline()

}
var user = getCookie("tracking");
if (user != "") {
  console.log("Welcome again " + user);
  track(user)
} else {
  user = Date.now().toString(16);
  if (user != "" && user != null) {
      console.log("Welcome new user " + user);
      setCookie("tracking", user, 365);
      track(user)
  }
}

function checkOnline() {
  firebase.database().ref('/tempUser/').orderByChild('state').equalTo("online").on("value", (data => {
      var liveVisitorCounter = data.numChildren();
      console.log(liveVisitorCounter);
      var root = document.getElementById('root');
      root.innerText = liveVisitorCounter;

  }))
}

const messages = document.getElementById('messages');

function appendMessage() {
    const message = document.getElementsByClassName('message')[0];
  const newMessage = message.cloneNode(true);
  messages.appendChild(newMessage);
}

function getMessages() {
    // Prior to getting your messages.
  shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
  /*
   * Get your messages, we'll just simulate it by appending a new one syncronously.
   */
  appendMessage();
  // After getting your messages.
  if (!shouldScroll) {
    scrollToBottom();
  }
}

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

scrollToBottom();

setInterval(getMessages, 100);