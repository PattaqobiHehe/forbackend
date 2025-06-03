// Global variables
let isEmailVerified = false;
let newEmailToVerify = '';
let otpResendTimer = null;

document.addEventListener("DOMContentLoaded", function () {
    initializeTheme();
    setupOtpInputs();
    populateUserProfile(); // Show user profile from localStorage
    loadComplaintsFromStorage(); // Load complaints from localStorage

    showSection('profile'); // Default section to show

    // Button event listeners
    document.getElementById("newComplaintBtn")?.addEventListener("click", () => {
        window.location.href = "complaintform.html";
    });

    document.getElementById("viewAllComplaintsBtn")?.addEventListener("click", () => {
        showSection('complaints');
    });

    document.getElementById("feedBtn")?.addEventListener("click", () => {
        showSection('feed');
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "index.html";
    });
});

// Display only one section at a time
function showSection(sectionId) {
    const sections = ['profile', 'complaints', 'feed', 'notifications', 'settings'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = section === sectionId ? 'block' : 'none';
        }
    });
}

// 🧩 Show user data saved from registration form
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

// 🧾 Load complaints made by user from localStorage
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
            </div>
            <div class="post-actions">
                <button class="like-btn"><i class="fas fa-thumbs-up"></i> <span class="like-count">0</span></button>
                <button class="save-btn"><i class="fas fa-bookmark"></i> Save</button>
            </div>
        `;
        feedList.appendChild(post);
    });
}

// ♻️ Theme switcher
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    localStorage.setItem('darkTheme', body.classList.contains('dark-theme'));
}

function initializeTheme() {
    const darkTheme = localStorage.getItem('darkTheme') === 'true';
    const body = document.body;
    if (darkTheme) body.classList.add('dark-theme');
}

// 🔄 OTP handlers
function setupOtpInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
}
