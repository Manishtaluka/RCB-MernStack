import Razorpay from "razorpay";

let razorpayInstance = null;

// Lazily initialized so the server doesn't crash on boot if Razorpay keys
// aren't set yet — the error only surfaces when a checkout is attempted.
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are not configured in .env");
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

export default getRazorpayInstance;
