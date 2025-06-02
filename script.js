const devMode = false;
let isEmailVerified = false;

// Initialize EmailJS
function initEmailJS() {
  if (!window.appConfig?.EMAILJS_USER_ID) {
    console.error("EmailJS configuration not found");
    if (devMode) {
      console.log("[DEV MODE] Using test EmailJS configuration");
      emailjs.init("rjCEs-TNXiSnm1aJb");
    }
    return false;
  }
  emailjs.init(window.appConfig.EMAILJS_USER_ID);
  console.log("EmailJS initialized successfully");
  return true;
}

// Google Sign-In
function handleCredentialResponse(response) {
  if (devMode) {
    const testUser = { email: "test@example.com", name: "Test User" };
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('googleUsername').placeholder = testUser.email;
    showUsernameModal();
    return;
  }

  try {
    const responsePayload = JSON.parse(atob(response.credential.split('.')[1]));
    console.log('Google User Info:', responsePayload);
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('googleUsername').placeholder = responsePayload.email || 'Choose username';
    showUsernameModal();
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    alert('Google Sign-In failed. Please try again.');
  }
}

function initGoogleSignIn() {
  if (devMode) {
    document.querySelector('.button-g').addEventListener('click', () => handleCredentialResponse({}));
    return;
  }

  if (!window.appConfig?.GOOGLE_CLIENT_ID) {
    console.error("Google Client ID not configured");
    return;
  }

  google.accounts.id.initialize({
    client_id: window.appConfig.GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    ux_mode: 'popup'
  });

  const googleSignInDiv = document.createElement('div');
  googleSignInDiv.style.display = 'none';
  document.body.appendChild(googleSignInDiv);

  google.accounts.id.renderButton(googleSignInDiv, { type: 'icon', size: 'large', theme: 'outline' });

  document.querySelector('.button-g').addEventListener('click', () => {
    const googleButton = googleSignInDiv.querySelector('div[role=button]');
    if (googleButton) googleButton.click();
  });
}

// OTP
function showOtpModal() {
  const emailInput = document.getElementById('email');
  const email = emailInput.value.trim();
  if (!OTPManager.validateEmail(email)) {
    showError(emailInput, "Please enter a valid email first");
    return;
  }

  const otpButton = document.getElementById('bt');
  otpButton.disabled = true;
  otpButton.textContent = 'Sending...';

  OTPManager.sendOTP(email).then(success => {
    if (success) {
      document.getElementById('otpModal').style.display = 'flex';
      document.querySelectorAll('.otp-input').forEach(input => input.value = '');
      document.getElementById('otp-input1').focus();
      OTPManager.startResendTimer(updateResendUI);
    } else {
      alert('Failed to send OTP. Please try again.');
    }
    otpButton.disabled = false;
    otpButton.textContent = 'Send OTP';
  });
}

function verifyOtp() {
  const enteredOtp = ['otp-input1', 'otp-input2', 'otp-input3', 'otp-input4']
    .map(id => document.getElementById(id).value)
    .join('');

  if (OTPManager.verifyOTP(enteredOtp)) {
    isEmailVerified = true;
    document.getElementById('bt').textContent = 'Verified ✓';
    document.getElementById('bt').style.backgroundColor = '#4CAF50';
    closeOtpModal();
    clearError(document.getElementById('email'));
  } else {
    alert('Invalid OTP or OTP has expired. Please try again.');
  }
}

function updateResendUI(seconds, canResend) {
  const resendNote = document.querySelector('.resendNote');
  resendNote.innerHTML = canResend
    ? `Didn't receive the code? <button class="resendBtn" onclick="resendOtp()">Resend Code</button>`
    : `Resend OTP in ${seconds} seconds`;
}

function resendOtp() {
  const email = document.getElementById('email').value;
  if (!OTPManager.validateEmail(email)) {
    alert('Please enter your email first');
    return;
  }
  OTPManager.sendOTP(email).then(success => {
    if (success) {
      OTPManager.startResendTimer(updateResendUI);
      alert('New OTP has been sent to your email');
    }
  });
}

function closeOtpModal() {
  document.getElementById('otpModal').style.display = 'none';
  OTPManager.clearTimer();
}

// Validation
const validationConfig = {
  fullName: { pattern: /^[A-Za-z\s]{1,32}$/, message: "Full name should contain only letters and spaces (max 32 characters)" },
  username: { pattern: /^[a-zA-Z0-9]{1,32}$/, message: "Username should contain only letters and numbers (max 32 characters)" },
  email: { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/, message: "Please enter a valid email address" },
  phoneNumber: { pattern: /^[6-9][0-9]{9}$/, message: "Phone number must start with 6-9 and have 10 digits" },
  houseNumber: { pattern: /^.+$/, message: "Please enter a valid house number" },
  address: { pattern: /^.+$/, message: "Please enter a valid address" },
  password: { pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{6,}$/, message: "Password must be at least 6 characters with an uppercase, lowercase and number." },
};

function initFormValidation() {
  document.querySelectorAll("input[required]").forEach((input) => {
    if (input.type !== "radio" && input.type !== "checkbox") {
      input.addEventListener("input", () => clearError(input));
    }
  });

  document.querySelectorAll('.otp-input').forEach((input, index) => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      if (e.target.value.length === 1 && index < 3) {
        document.querySelectorAll('.otp-input')[index + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        document.querySelectorAll('.otp-input')[index - 1].focus();
      }
    });
  });

  document.getElementById("registrationForm").addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    if (!isEmailVerified) {
      showError(document.getElementById('email'), "Please verify your email with OTP first");
      return;
    }

    // ✅ Save user profile to localStorage
    const userProfile = {
      fullName: document.getElementById('fullName').value.trim(),
      username: document.getElementById('username').value.trim(),
      email: document.getElementById('email').value.trim(),
      phoneNumber: document.getElementById('phoneNumber').value.trim(),
      houseNumber: document.getElementById('houseNumber').value.trim(),
      address: document.getElementById('address').value.trim(),
      password: document.getElementById('password').value,
      gender: document.querySelector('input[name="radio-group"]:checked')?.id || 'Not specified',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    alert('Registration successful!');
    window.location.href = 'dashboard.html';
  });
}

function validateForm() {
  let isValid = true;

  document.querySelectorAll("input[required]").forEach(input => {
    if (input.type !== "radio" && input.type !== "checkbox") {
      if (!validateInput(input, validationConfig)) isValid = false;
    }
  });

  if (!document.querySelector('input[name="radio-group"]:checked')) {
    showError(document.querySelector('.gender-details-box'), "Please select a gender");
    isValid = false;
  }

  if (!grecaptcha.getResponse()) {
    showError(document.querySelector('.g-recaptcha'), "Please complete the reCAPTCHA");
    isValid = false;
  }

  return isValid;
}

function validateInput(input, config) {
  const rules = config[input.id] || config[input.name];
  if (rules && !rules.pattern.test(input.value)) {
    showError(input, rules.message);
    return false;
  }
  clearError(input);
  return true;
}

function showError(element, message) {
  clearError(element);
  const errorMsg = document.createElement("div");
  errorMsg.className = "error-message";
  errorMsg.textContent = message;
  element.insertAdjacentElement("afterend", errorMsg);
  element.classList.add("invalid");
}

function clearError(element) {
  const errorMsg = element.nextElementSibling;
  if (errorMsg?.classList.contains("error-message")) {
    errorMsg.remove();
  }
  element.classList.remove("invalid");
}

// Modal functions
function showUsernameModal() {
  document.getElementById('usernameModal').style.display = 'flex';
}

function closeUsernameModal() {
  document.getElementById('usernameModal').style.display = 'none';
}

function submitGoogleRegistration() {
  const usernameInput = document.getElementById('googleUsername');
  if (!usernameInput.value.trim()) {
    showError(usernameInput, "Username is required");
    return;
  }

  if (!/^[a-zA-Z0-9]{1,32}$/.test(usernameInput.value)) {
    showError(usernameInput, "Only letters and numbers allowed (max 32 chars)");
    return;
  }

  alert(`Account created with username: ${usernameInput.value}`);
  window.location.href = '/welcome';
}

// Init
window.onload = function () {
  if (devMode) document.getElementById('dev-mode-notice').style.display = 'block';
  initEmailJS();
  if (window.google || devMode) initGoogleSignIn();
  else setTimeout(initGoogleSignIn, 500);
  initFormValidation();
};
