//import { sendOTP } from "../../data/forgot_password";


// console.log('im here')
const form = document.querySelector('#forgot-password-form');
const submitEmailBtn = document.querySelector('#submit-email');

submitEmailBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value;

    // Send OTP to user's email

    // sendOTP(email, otp_sent);

    // Show OTP verification form
    showOTPForm();
});

function showOTPForm() {
    // Hide email form and show OTP verification form
    form.innerHTML = `
      <h2>Verify OTP</h2>
      <form id="otp-form">
        <label for="otp">Enter OTP:</label>
        <input type="number" id="otp" name="otp" required>
        <button type="submit" id="submit-otp">Verify</button>
      </form>
    `;

    const otpForm = document.querySelector('#otp-form');
    const submitOTPBtn = document.querySelector('#submit-otp');

    submitOTPBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const otp = document.querySelector('#otp').value;

        // Verify OTP
        if (verifyOTP(otp)) {
            // Show password reset form
            showPasswordResetForm();
        } else {
            alert('Invalid OTP. Please try again.');
        }
    });
}

function verifyOTP(otp) {
    // Code to verify OTP goes here
    if (otp === otp_sent) {
        return true;
    }
}

function showPasswordResetForm() {
    // Hide OTP verification form and show password reset form
    form.innerHTML = `
      <h2>Reset Password</h2>
      <form id="password-reset-form">
        <label for="new-password">New Password:</label>
        <input type="password" id="new-password" name="new-password" required>
        <label for="confirm-password">Confirm Password:</label>
        <input type="password" id="confirm-password" name="confirm-password" required>
        <button type="submit" id="submit-password-reset">Reset Password</button>
      </form>
    `;

    const passwordResetForm = document.querySelector('#password-reset-form');
    const submitPasswordResetBtn = document.querySelector('#submit-password-reset');

    submitPasswordResetBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const newPassword = document.querySelector('#new-password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;

        // Verify new password and confirm password match
        if (newPassword === confirmPassword) {
            // Reset user's password
            resetPassword(newPassword);
            alert('Your password has been successfully reset.');
        } else {
            alert('New password and confirm password do not match. Please try again.');
        }
    });
}

function resetPassword(newPassword) {
    // Code to reset user's password goes here
}
