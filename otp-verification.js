const OTPManager = (function() {
  let generatedOtp = '';
  let otpExpiryTime = null;
  let otpResendTimer = null;
  const resendTimeout = 30; // seconds between OTP resends

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function sendOTP(email) {
    if (!validateEmail(email)) {
      console.error("Invalid email address:", email);
      return false;
    }

    generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    otpExpiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    if (devMode) {
      console.log(`[DEV MODE] Generated OTP: ${generatedOtp}`);
      return true;
    }

    try {
      const response = await emailjs.send(
        window.appConfig.EMAILJS_SERVICE_ID,
        window.appConfig.EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          otp_code: generatedOtp,
          expiry_time: "10 minutes"
        }
      );

      alert("Response Status: " + response.status);
      console.log("OTP sent successfully to:", email);
      return response.status === 200;
    } catch (error) {
      alert("EmailJS Error: " + JSON.stringify(error));
      console.error("EmailJS error:", error);
      return false;
    }
  }

  function verifyOTP(enteredOtp) {
    if (!enteredOtp || enteredOtp.length !== 4) return false;
    if (Date.now() > otpExpiryTime) {
      console.error("OTP expired");
      return false;
    }
    return enteredOtp === generatedOtp;
  }

  function startResendTimer(callback) {
    clearTimer();
    let seconds = resendTimeout;
    callback(seconds, false);

    otpResendTimer = setInterval(() => {
      seconds--;
      callback(seconds, seconds <= 0);

      if (seconds <= 0) {
        clearTimer();
      }
    }, 1000);
  }

  function clearTimer() {
    if (otpResendTimer) {
      clearInterval(otpResendTimer);
      otpResendTimer = null;
    }
  }

  return {
    sendOTP,
    verifyOTP,
    startResendTimer,
    clearTimer,
    validateEmail
  };
})();
