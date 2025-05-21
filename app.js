// Firebase Config (Replace with yours)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // DOM Elements
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const logForm = document.getElementById("log-form");
  const logInput = document.getElementById("log-input");
  const submitLog = document.getElementById("submit-log");
  const logsContainer = document.getElementById("logs-container");
  
  // Login with Google
  loginBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  });
  
  // Logout
  logoutBtn.addEventListener("click", () => {
    auth.signOut();
  });
  
  // Submit Log
  submitLog.addEventListener("click", () => {
    const logText = logInput.value.trim();
    if (logText) {
      db.collection("logs").add({
        content: logText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Anonymous"
      });
      logInput.value = "";
    }
  });
  
  // Auth State Listener
  auth.onAuthStateChanged(user => {
    if (user) {
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
      logForm.style.display = "block";
    } else {
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
      logForm.style.display = "none";
    }
  });
  
  // Real-Time Logs Display
  db.collection("logs")
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      logsContainer.innerHTML = "";
      snapshot.forEach(doc => {
        const log = doc.data();
        const logElement = document.createElement("div");
        logElement.className = "log-entry";
        logElement.innerHTML = `
          <p>${log.content}</p>
          <small>
            Posted by ${log.userName} at 
            ${log.timestamp?.toDate().toLocaleString()}
          </small>
        `;
        logsContainer.appendChild(logElement);
      });
    });