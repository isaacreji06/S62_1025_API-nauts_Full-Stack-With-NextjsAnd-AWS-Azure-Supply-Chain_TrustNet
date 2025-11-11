"use client";
import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";

export default function LoginPage() {
  const [sendOtp, setSendOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false); // 👈 added loading state

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setPhoneNumber(numericValue);
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("Recaptcha verified"),
        }
      );
    }
  };

  const sendOtpFunction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      setLoading(true); // 👈 start loading
      const fullNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+91${phoneNumber}`;

      const confirmation = await signInWithPhoneNumber(
        auth,
        fullNumber,
        appVerifier
      );

      setConfirmationResult(confirmation);
      setSendOtp(true);
      toast.success("OTP sent successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to send OTP. Try again.");
    } finally {
      setLoading(false); // 👈 stop loading
    }
  };

  const verifyOtpFunction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("OTP verified successfully!");
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f5f8ff]">
      <div className="mt-24 bg-white p-10 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-8">
          Sign in to continue to{" "}
          <span className="text-blue-600 font-semibold">TrustNet</span>
        </p>

        <form
          className="flex flex-col gap-4"
          onSubmit={sendOtp ? verifyOtpFunction : sendOtpFunction}
        >
          <input
            type="text"
            placeholder="Phone Number"
            required
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {sendOtp && (
            <input
              type="text"
              placeholder="Enter the OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium py-2 rounded-lg transition flex justify-center items-center gap-2`}
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : sendOtp ? (
              "Verify OTP"
            ) : (
              "Get OTP"
            )}
          </button>

          <div id="recaptcha-container"></div>
        </form>

        <p className="text-gray-600 mt-6 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
