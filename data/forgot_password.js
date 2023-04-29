import nodemailer from 'nodemailer';

export async function sendOTP(email, otp) {
    // Code to send OTP to user's email goes here

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

export function generateOTP() {
    // Generate a random 4-digit number between 1000 and 9999
    const min = 1000;
    const max = 9999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;

    return otp;
}
