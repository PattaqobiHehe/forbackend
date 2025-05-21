// Make sure this is at the top of your login.js file
document.addEventListener('DOMContentLoaded', function() {
  // All your existing JavaScript code here
  const container = document.querySelector('.container');
  const registerBtn = document.querySelector('.register-btn');
  const loginBtn = document.querySelector('.login-btn');
  const googleBtn = document.querySelector('.button-g'); // Add this line to select the Google button

  registerBtn.addEventListener('click', () => {
      container.classList.add('active');
  });

  loginBtn.addEventListener('click', () => {
      container.classList.remove('active');
  });

  // Add this event listener for the Google button
  googleBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent any default behavior
      // You can add any Google sign-in logic here if needed
      // For now, it will just bypass the input fields
      console.log("Google sign-in clicked");
  });

  // Rest of your existing code...
  // Forgot Password Modal
  const forgotLink = document.querySelector('.forgot-link a');
  const forgotModal = document.getElementById('forgotPasswordModal');
  const closeModal = document.querySelector('.close-modal');
  const sendResetBtn = document.getElementById('sendResetBtn');
  const forgotEmail = document.getElementById('forgotEmail');
  const forgotMessage = document.getElementById('forgotMessage');

  // Open modal when forgot password is clicked
  forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      forgotModal.style.display = 'block';
  });

  // Close modal when X is clicked
  closeModal.addEventListener('click', () => {
      forgotModal.style.display = 'none';
      resetForgotForm();
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
      if (e.target == forgotModal) {
          forgotModal.style.display = 'none';
          resetForgotForm();
      }
  });

  // Validate email and show message
  sendResetBtn.addEventListener('click', () => {
      const email = forgotEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      forgotMessage.classList.remove('success', 'error');
      forgotMessage.style.display = 'none';
      
      if (!email) {
          showMessage('Please enter your email address', 'error');
          return;
      }
      
      if (!emailRegex.test(email)) {
          showMessage('Please enter a valid email address', 'error');
          return;
      }
      
      // Simulate sending reset link (in a real app, you would make an API call here)
      showMessage('Password reset link has been sent to your email', 'success');
      
      // Reset form after 3 seconds
      setTimeout(() => {
          forgotModal.style.display = 'none';
          resetForgotForm();
      }, 3000);
  });

  function showMessage(text, type) {
      forgotMessage.textContent = text;
      forgotMessage.classList.add(type);
      forgotMessage.style.display = 'block';
  }

  function resetForgotForm() {
      forgotEmail.value = '';
      forgotMessage.textContent = '';
      forgotMessage.classList.remove('success', 'error');
      forgotMessage.style.display = 'none';
  }
});