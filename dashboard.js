// Global variables
let isEmailVerified = false;
let newEmailToVerify = '';
let otpResendTimer = null;

document.addEventListener("DOMContentLoaded", function () {
    initializeTheme();
    loadComplaintsFromStorage();
    setupOtpInputs();
    populateUserProfile();

    showSection('profile');

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        alert("Logging out...");
    });
});

function populateUserProfile() {
  const profile = JSON.parse(localStorage.getItem("userProfile"));
  if (!profile) return;

  const profileDetails = document.querySelector('.profile-details');
  if (!profileDetails) return;

  const fields = [
    { label: 'Name', value: profile.fullName },
    { label: 'Username', value: profile.username },
    { label: 'Email', value: profile.email },
    { label: 'Phone', value: profile.phoneNumber },
    { label: 'House No.', value: profile.houseNumber },
    { label: 'Address', value: profile.address },
    { label: 'Gender', value: profile.gender }
  ];

  profileDetails.innerHTML = fields.map(f =>
    `<p><strong>${f.label}:</strong> <span>${f.value || ''}</span></p>`
  ).join('');
}

function loadComplaintsFromStorage() {
    const complaints = JSON.parse(localStorage.getItem("userComplaints") || "[]");
    const feedList = document.getElementById("feedList");
    feedList.innerHTML = '';

    if (complaints.length === 0) {
        feedList.innerHTML = "<p>No complaints submitted yet.</p>";
        return;
    }

    complaints.forEach((complaint) => {
        const post = document.createElement("div");
        post.className = "post";
        post.innerHTML = `
        <div class="post-header">
            <img src="profile-pic.jpg" alt="Profile Picture" class="profile-pic" />
            <span class="username">You</span>
        </div>
        <div class="post-content">
            <h3 class="subject">${complaint.subject}</h3>
            ${complaint.imageBase64 ? `<img src="${complaint.imageBase64}" alt="Attached Image" class="complaint-image" />` : ''}
            <p class="description">${complaint.description}</p>
            <p class="meta">
                <strong>Zone:</strong> ${complaint.zoneName} |
                <strong>Ward:</strong> ${complaint.wardNo} |
                <strong>Type:</strong> ${complaint.complaintType}
            </p>
            <p class="timestamp"><em>Submitted: ${new Date(complaint.timestamp).toLocaleString()}</em></p>
        </div>`;
        feedList.appendChild(post);
    });
}
