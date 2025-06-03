// Global variables
let isEmailVerified = false;
let newEmailToVerify = '';
let otpResendTimer = null;

document.addEventListener("DOMContentLoaded", function () {
    initializeTheme();
    loadComplaintsFromStorage();
    setupOtpInputs();
    populateProfileFromStorage(); // 🔄 Load registered user data
    populateUserProfile(); // ✅ This shows user profile from registration

    showSection('profile');

    // Event Listeners
    document.getElementById("newComplaintBtn")?.addEventListener("click", () => {
        alert("Redirect to new complaint form");
    });

    document.getElementById("viewAllComplaintsBtn")?.addEventListener("click", () => {
        alert("Redirect to all complaints page");
    });

    document.getElementById("feedBtn")?.addEventListener("click", () => {
        alert("Redirect to feed page");
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        alert("Logging out...");
        // Redirect to login page
    });

    // Form Submissions
    document.getElementById('usernameForm')?.addEventListener('submit', handleUsernameSubmit);
    document.getElementById('addressForm')?.addEventListener('submit', handleAddressSubmit);
    document.getElementById('numberForm')?.addEventListener('submit', handleNumberSubmit);
    document.getElementById('emailForm')?.addEventListener('submit', handleEmailSubmit);
    document.getElementById('passwordForm')?.addEventListener('submit', handlePasswordSubmit);
    document.getElementById('bugReportForm')?.addEventListener('submit', handleBugReportSubmit);

    document.getElementById('verifyOtpBtn')?.addEventListener('click', verifyOTP);
    document.getElementById('resendOtpBtn')?.addEventListener('click', resendOTP);
    document.getElementById('toggle')?.addEventListener('change', toggleTheme);

    document.getElementById('emailNotifications')?.addEventListener('change', () => {
        toggleSubOptions('emailNotifications', 'emailSubOptions');
    });

    document.getElementById('pushNotifications')?.addEventListener('change', () => {
        toggleSubOptions('pushNotifications', 'pushSubOptions');
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

function populateProfileFromStorage() {
    const user = JSON.parse(localStorage.getItem("registeredUser"));
    if (!user) return;

    // Fill profile fields from storage
    const profile = document.querySelector('.profile-details');
    if (!profile) return;

    profile.querySelector('p:nth-child(2) strong').nextSibling.textContent = ` ${user.username}`;
    profile.querySelector('p:nth-child(3) strong').nextSibling.textContent = ` ${user.email}`;
    profile.querySelector('p:nth-child(4) strong').nextSibling.textContent = ` ${user.phoneNumber}`;
    profile.querySelector('p:nth-child(5) strong').nextSibling.textContent = ` ${user.address}`;
    profile.querySelector('p:nth-child(6) strong').nextSibling.textContent = ` ${user.gender}`;
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
        </div>
        <div class="post-actions">
            <button class="like-btn"><i class="fas fa-thumbs-up"></i> <span class="like-count">0</span></button>
            <button class="save-btn"><i class="fas fa-bookmark"></i> Save</button>
        </div>
        <div class="comments-section">
            <div class="comment">
                <span class="comment-username">Support Team</span>
                <span class="comment-text">Thank you for your complaint. We'll review it soon.</span>
            </div>
            <input type="text" class="comment-input" placeholder="Add a comment..." />
        </div>`;
        feedList.appendChild(post);
    });
}

// ✅ Form handlers below will also update the registeredUser in localStorage:
function handleUsernameSubmit(e) {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const user = JSON.parse(localStorage.getItem("registeredUser") || "{}");
    if (newUsername) {
        document.querySelector('.profile-details p:nth-child(2) strong').nextSibling.textContent = newUsername;
        user.username = newUsername;
        localStorage.setItem("registeredUser", JSON.stringify(user));
        showSuccessMessage('Username updated successfully!');
        document.getElementById('usernameChangeForm').style.display = 'none';
    }
}

function handleAddressSubmit(e) {
    e.preventDefault();
    const newAddress = document.getElementById('newAddress').value;
    const user = JSON.parse(localStorage.getItem("registeredUser") || "{}");
    if (newAddress) {
        document.querySelector('.profile-details p:nth-child(5) strong').nextSibling.textContent = newAddress;
        user.address = newAddress;
        localStorage.setItem("registeredUser", JSON.stringify(user));
        showSuccessMessage('Address updated successfully!');
        document.getElementById('addressChangeForm').style.display = 'none';
    }
}

function handleNumberSubmit(e) {
    e.preventDefault();
    const newNumber = document.getElementById('newNumber').value;
    const user = JSON.parse(localStorage.getItem("registeredUser") || "{}");
    if (newNumber) {
        document.querySelector('.profile-details p:nth-child(4) strong').nextSibling.textContent = newNumber;
        user.phoneNumber = newNumber;
        localStorage.setItem("registeredUser", JSON.stringify(user));
        showSuccessMessage('Phone number updated successfully!');
        document.getElementById('numberChangeForm').style.display = 'none';
    }
}

function handleEmailSubmit(e) {
    e.preventDefault();
    newEmailToVerify = document.getElementById('newEmail').value.trim();
    const user = JSON.parse(localStorage.getItem("registeredUser") || "{}");

    if (!validateEmail(newEmailToVerify)) {
        alert('Please enter a valid email address');
        return;
    }

    const verifyBtn = document.getElementById('verifyEmailBtn');
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Sending OTP...';

    setTimeout(() => {
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify Email';
        showOtpModal();
    }, 1500);

    // Store email for later
    user.pendingEmail = newEmailToVerify;
    localStorage.setItem("registeredUser", JSON.stringify(user));
}

function verifyOTP() {
    const otp = Array.from(document.querySelectorAll('.otp-input')).map(input => input.value).join('');
    if (otp.length === 4) {
        const user = JSON.parse(localStorage.getItem("registeredUser") || "{}");
        user.email = user.pendingEmail;
        delete user.pendingEmail;
        localStorage.setItem("registeredUser", JSON.stringify(user));

        document.querySelector('.profile-details p:nth-child(3) strong').nextSibling.textContent = ` ${user.email}`;
        closeOtpModal();
        document.getElementById('emailChangeForm').style.display = 'none';
        showSuccessMessage('Email updated successfully!');
    } else {
        alert('Invalid OTP. Please try again.');
    }
}

// ✅ Leave other utility functions as they are (toggleTheme, OTP setup, notification preferences, etc.)

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showSuccessMessage(title, subtitle = '') {
    const successMessage = document.getElementById('successMessage');
    const messageText = document.querySelector('.message-text');
    const subText = document.querySelector('.sub-text');

    messageText.textContent = title;
    subText.textContent = subtitle;
    successMessage.style.display = 'flex';

    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 4000);
                                         }
