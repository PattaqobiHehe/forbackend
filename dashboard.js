// Global variables
let isEmailVerified = false;
let newEmailToVerify = '';
let otpResendTimer = null;

document.addEventListener("DOMContentLoaded", function () {
    // Initialize theme from localStorage
    initializeTheme();
    // Lodging the Complaints 
    loadComplaintsFromStorage();
    // Initialize OTP verification
    setupOtpInputs();
    
    // Example data population (can be removed if not needed)
    const complaints = [
        { id: 1, title: "Pothole on Main St", status: "Pending" },
        { id: 2, title: "Garbage not collected", status: "Resolved" },
    ];
    
    const activities = [
        { id: 1, text: "Your complaint 'Pothole on Main St' has been updated." },
        { id: 2, text: "New comment on your complaint 'Garbage not collected'." },
    ];
    
    const notifications = [
        { id: 1, text: "New system update available." },
        { id: 2, text: "Reminder: Submit your monthly feedback." },
    ];
    
    // Show the My Profile section by default when the page loads
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
    
    // Form submissions
    document.getElementById('usernameForm')?.addEventListener('submit', handleUsernameSubmit);
    document.getElementById('addressForm')?.addEventListener('submit', handleAddressSubmit);
    document.getElementById('numberForm')?.addEventListener('submit', handleNumberSubmit);
    document.getElementById('emailForm')?.addEventListener('submit', handleEmailSubmit);
    document.getElementById('passwordForm')?.addEventListener('submit', handlePasswordSubmit);
    document.getElementById('bugReportForm')?.addEventListener('submit', handleBugReportSubmit);

    
  function loadComplaintsFromStorage() {
  const complaints = JSON.parse(localStorage.getItem("userComplaints") || "[]");
  const feedList = document.getElementById("feedList");
  feedList.innerHTML = '';

  if (complaints.length === 0) {
    feedList.innerHTML = "<p>No complaints submitted yet.</p>";
    return;
  }

  complaints.forEach((complaint, index) => {
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
    
    // OTP verification
    document.getElementById('verifyOtpBtn')?.addEventListener('click', verifyOTP);
    document.getElementById('resendOtpBtn')?.addEventListener('click', resendOTP);
    
    // Theme toggle
    document.getElementById('toggle')?.addEventListener('change', toggleTheme);
    
    // Notification preferences
    document.getElementById('emailNotifications')?.addEventListener('change', function() {
        toggleSubOptions('emailNotifications', 'emailSubOptions');
    });
    
    document.getElementById('pushNotifications')?.addEventListener('change', function() {
        toggleSubOptions('pushNotifications', 'pushSubOptions');
    });
});

// Section Navigation
function showSection(sectionId) {
    const sections = ['profile', 'complaints', 'feed', 'notifications', 'settings'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = section === sectionId ? 'block' : 'none';
        }
    });
}

// Toggle Functions
function toggleStatusSection() {
    const form = document.getElementById('statusSection');
    const button = document.querySelector('.activity-item[onclick="toggleStatusSection()"]');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    button?.classList.toggle('expanded');
}

function toggleUsernameChange() {
    const form = document.getElementById('usernameChangeForm');
    const button = document.querySelector('.activity-item[onclick="toggleUsernameChange()"]');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    button?.classList.toggle('expanded');
}

function toggleAddressChange() {
    const form = document.getElementById('addressChangeForm');
    const button = document.querySelector('.activity-item[onclick="toggleAddressChange()"]');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    button?.classList.toggle('expanded');
}

function togglePhNumberChange() {
    const form = document.getElementById('numberChangeForm');
    const button = document.querySelector('.activity-item[onclick="togglePhNumberChange()"]');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    button?.classList.toggle('expanded');
}

function toggleEmailChange() {
    const form = document.getElementById('emailChangeForm');
    const button = document.querySelector('.activity-item[onclick="toggleEmailChange()"]');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    button?.classList.toggle('expanded');
}

function togglePasswordChange() {
    const form = document.getElementById('passwordChangeForm');
    const button = document.querySelector('.activity-item[onclick="togglePasswordChange()"]');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    button?.classList.toggle('expanded');
}

function toggleNotificationPreference() {
    const form = document.getElementById('notificationPreferenceForm');
    const chevron = document.querySelector('.activity-item[onclick="toggleNotificationPreference()"] .fa-chevron-down');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    chevron.style.transform = form.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
    
    if (form.style.display === 'block') {
        loadNotificationPreferences();
    }
}

function togglePrivacyChanges() {
    const form = document.getElementById('privacySettingsForm');
    const chevron = document.querySelector('.activity-item[onclick="togglePrivacyChanges()"] .fa-chevron-down');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    chevron.style.transform = form.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
    
    if (form.style.display === 'block') {
        loadPrivacySettings();
    }
}

function togglePrivacySection(sectionId) {
    const section = document.getElementById(sectionId + 'Section')?.parentElement;
    section?.classList.toggle('active');
}

function toggleReportBug(e) {
    if (e) e.stopPropagation();
    const form = document.getElementById('ReportBugForm');
    const chevron = document.querySelector('.activity-item[onclick="toggleReportBug(event)"] .fa-chevron-down');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    chevron.style.transform = form.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
}

// Form Handlers
function handleUsernameSubmit(e) {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    if (newUsername) {
        document.querySelector('.profile-details p:nth-child(2) strong').nextSibling.textContent = newUsername;
        showSuccessMessage('Username updated successfully!');
        document.getElementById('usernameChangeForm').style.display = 'none';
    }
}

function handleAddressSubmit(e) {
    e.preventDefault();
    const newAddress = document.getElementById('newAddress').value;
    if (newAddress) {
        document.querySelector('.profile-details p:nth-child(5) strong').nextSibling.textContent = newAddress;
        showSuccessMessage('Address updated successfully!');
        document.getElementById('addressChangeForm').style.display = 'none';
    }
}

function handleNumberSubmit(e) {
    e.preventDefault();
    const newNumber = document.getElementById('newNumber').value;
    if (newNumber) {
        document.querySelector('.profile-details p:nth-child(4) strong').nextSibling.textContent = newNumber;
        showSuccessMessage('Phone number updated successfully!');
        document.getElementById('numberChangeForm').style.display = 'none';
    }
}

function handleEmailSubmit(e) {
    e.preventDefault();
    newEmailToVerify = document.getElementById('newEmail').value.trim();
    
    if (!validateEmail(newEmailToVerify)) {
        alert('Please enter a valid email address');
        return;
    }

    const verifyBtn = document.getElementById('verifyEmailBtn');
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Sending OTP...';

    // Simulate OTP sending (replace with actual API call)
    setTimeout(() => {
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify Email';
        showOtpModal();
    }, 1500);
}
    function handlePasswordSubmit(e) {
    e.preventDefault();
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match.');
        return;
    }

    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long.');
        return;
    }

    showSuccessMessage('Password changed successfully!');
    document.getElementById('passwordForm').reset();
    togglePasswordChange();
}

function handleBugReportSubmit(e) {
    e.preventDefault();
    const bugDescription = document.getElementById('bugDescription');
    const bugReportMessage = document.getElementById('bugReportMessage');
    
    bugReportMessage.textContent = '';
    bugReportMessage.className = '';
    bugReportMessage.style.display = 'none';
    
    if (!bugDescription.value.trim()) {
        showBugMessage('Please fill out the description field', 'error');
        return;
    }
    
    if (bugDescription.value.trim().length < 20) {
        showBugMessage('Please provide more details (at least 20 characters)', 'error');
        return;
    }
    
    showBugMessage('Your bug report has been submitted successfully! We will review it shortly.', 'success');
    
    setTimeout(() => {
        document.getElementById('bugReportModal').style.display = 'none';
        resetBugReportForm();
        showSuccessMessage('Bug Report Submitted', 'Thank you for helping us improve!');
    }, 3000);
}

// OTP Functions
function showOtpModal() {
    document.getElementById('otpModal').style.display = 'flex';
    document.querySelectorAll('.otp-input').forEach(input => input.value = '');
    document.getElementById('otp-input1').focus();
    startResendTimer();
}

function closeOtpModal() {
    document.getElementById('otpModal').style.display = 'none';
    if (otpResendTimer) clearInterval(otpResendTimer);
}

function startResendTimer() {
    let seconds = 30;
    const resendBtn = document.getElementById('resendOtpBtn');
    const resendNote = document.querySelector('.resendNote');
    
    resendBtn.disabled = true;
    resendNote.textContent = `Resend OTP in ${seconds} seconds`;
    
    otpResendTimer = setInterval(() => {
        seconds--;
        resendNote.textContent = `Resend OTP in ${seconds} seconds`;
        
        if (seconds <= 0) {
            clearInterval(otpResendTimer);
            resendBtn.disabled = false;
        }
    }, 1000);
}

function setupOtpInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < 3) {
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

function verifyOTP() {
    const otp = Array.from(document.querySelectorAll('.otp-input'))
                   .map(input => input.value)
                   .join('');
    
    // Simulate OTP verification (replace with actual verification)
    if (otp.length === 4) { // Basic check for demo purposes
        document.querySelector('.profile-details p:nth-child(3) strong').nextSibling.textContent = newEmailToVerify;
        closeOtpModal();
        document.getElementById('emailChangeForm').style.display = 'none';
        showSuccessMessage('Email updated successfully!');
    } else {
        alert('Invalid OTP. Please try again.');
    }
}

function resendOTP() {
    if (!newEmailToVerify) return;
    
    const resendBtn = document.getElementById('resendOtpBtn');
    resendBtn.disabled = true;
    
    // Simulate OTP resend (replace with actual API call)
    setTimeout(() => {
        startResendTimer();
        alert('New OTP sent!');
    }, 1000);
}

// Theme Functions
function toggleTheme() {
    const body = document.body;
    const toggle = document.getElementById('toggle');
    
    body.classList.toggle('dark-theme');
    localStorage.setItem('darkTheme', body.classList.contains('dark-theme'));
    
    // Force redraw for elements that might not update immediately
    document.querySelectorAll('h1, h2, h3, h4, label').forEach(el => {
        el.style.display = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.display = '';
    });
}

function initializeTheme() {
    const darkTheme = localStorage.getItem('darkTheme') === 'true';
    const body = document.body;
    const toggle = document.getElementById('toggle');
    
    if (darkTheme) {
        body.classList.add('dark-theme');
        if (toggle) toggle.checked = true;
    }
}

// Notification Preferences
function loadNotificationPreferences() {
    const prefs = JSON.parse(localStorage.getItem('notificationPreferences')) || {};
    
    document.getElementById('emailNotifications').checked = prefs.emailNotifications !== false;
    document.getElementById('emailCommentNotifications').checked = prefs.emailCommentNotifications !== false;
    document.getElementById('emailStatusNotifications').checked = prefs.emailStatusNotifications !== false;
    document.getElementById('emailWeeklyDigest').checked = prefs.emailWeeklyDigest || false;
    
    document.getElementById('pushNotifications').checked = prefs.pushNotifications !== false;
    document.getElementById('pushUrgentNotifications').checked = prefs.pushUrgentNotifications !== false;
    document.getElementById('pushMessageNotifications').checked = prefs.pushMessageNotifications !== false;
    
    toggleSubOptions('emailNotifications', 'emailSubOptions');
    toggleSubOptions('pushNotifications', 'pushSubOptions');
}

function saveNotificationPreferences() {
    const prefs = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        emailCommentNotifications: document.getElementById('emailCommentNotifications').checked,
        emailStatusNotifications: document.getElementById('emailStatusNotifications').checked,
        emailWeeklyDigest: document.getElementById('emailWeeklyDigest').checked,
        pushNotifications: document.getElementById('pushNotifications').checked,
        pushUrgentNotifications: document.getElementById('pushUrgentNotifications').checked,
        pushMessageNotifications: document.getElementById('pushMessageNotifications').checked
    };
    
    localStorage.setItem('notificationPreferences', JSON.stringify(prefs));
    showSuccessMessage('Preferences Saved', 'Your notification preferences have been updated');
}

function toggleSubOptions(mainToggleId, subOptionsId) {
    const mainToggle = document.getElementById(mainToggleId);
    const subOptions = document.getElementById(subOptionsId);
    
    if (mainToggle?.checked) {
        subOptions.style.display = 'block';
    } else {
        subOptions.style.display = 'none';
    }
}

// Privacy Settings
function loadPrivacySettings() {
    const settings = JSON.parse(localStorage.getItem('privacySettings')) || {};
    
    document.getElementById('publicProfile').checked = settings.publicProfile || false;
    document.getElementById('showEmail').checked = settings.showEmail || false;
    document.getElementById('showPhone').checked = settings.showPhone || false;
    document.getElementById('showAddress').checked = settings.showAddress || false;
    document.getElementById('showComplaints').checked = settings.showComplaints !== false;
    document.getElementById('showComments').checked = settings.showComments !== false;
    document.getElementById('showLikes').checked = settings.showLikes || false;
    document.getElementById('allowAnalytics').checked = settings.allowAnalytics || false;
    document.getElementById('allowPersonalizedAds').checked = settings.allowPersonalizedAds || false;
    document.getElementById('searchEngineVisibility').checked = settings.searchEngineVisibility || false;
    document.getElementById('twoFactorAuth').checked = settings.twoFactorAuth || false;
}

function savePrivacySettings() {
    const settings = {
        publicProfile: document.getElementById('publicProfile').checked,
        showEmail: document.getElementById('showEmail').checked,
        showPhone: document.getElementById('showPhone').checked,
        showAddress: document.getElementById('showAddress').checked,
        showComplaints: document.getElementById('showComplaints').checked,
        showComments: document.getElementById('showComments').checked,
        showLikes: document.getElementById('showLikes').checked,
        allowAnalytics: document.getElementById('allowAnalytics').checked,
        allowPersonalizedAds: document.getElementById('allowPersonalizedAds').checked,
        searchEngineVisibility: document.getElementById('searchEngineVisibility').checked,
        twoFactorAuth: document.getElementById('twoFactorAuth').checked
    };
    
    localStorage.setItem('privacySettings', JSON.stringify(settings));
    showSuccessMessage('Privacy Settings Saved', 'Your privacy preferences have been updated');
}

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function previewImage(event) {
    const reader = new FileReader();
    const preview = document.getElementById('profilePicturePreview');
    reader.onload = function() {
        preview.src = reader.result;
        preview.style.display = 'block';
    }
    reader.readAsDataURL(event.target.files[0]);
}

function showBugMessage(text, type) {
    const bugReportMessage = document.getElementById('bugReportMessage');
    bugReportMessage.textContent = text;
    bugReportMessage.className = type;
    bugReportMessage.style.display = 'block';
}

function resetBugReportForm() {
    document.getElementById('bugDescription').value = '';
    const bugReportMessage = document.getElementById('bugReportMessage');
    bugReportMessage.textContent = '';
    bugReportMessage.className = '';
    bugReportMessage.style.display = 'none';
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
    }, 5000);
}
