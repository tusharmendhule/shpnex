"use client";

import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [tab, setTab] = useState<"email" | "phone">("email");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [confirmation, setConfirmation] = useState<any>(null);
  const [step, setStep] = useState<"phone" | "otp">("phone");

  // ✅ Google Login
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      router.push("/"); // 🔥 redirect
    } catch (err) {
      console.error(err);
      alert("Google login failed ❌");
    }
  };

  // ✅ Email Login
  const emailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, "123456");

      router.push("/"); // 🔥 redirect
    } catch (err) {
      console.error(err);
      alert("User not found. Create account in Firebase first.");
    }
  };

  // ✅ Send OTP
  const sendOTP = async () => {
    try {
      if (!phone.startsWith("+")) {
        alert("Use format: +91XXXXXXXXXX");
        return;
      }

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha",
        { size: "invisible" }
      );

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );

      setConfirmation(result);
      setStep("otp");
    } catch (error) {
      console.error(error);
      alert("OTP failed ❌");
    }
  };

  // ✅ Verify OTP
  const verifyOTP = async () => {
    try {
      await confirmation.confirm(otp);

      router.push("/"); // 🔥 redirect
    } catch (err) {
      console.error(err);
      alert("Wrong OTP ❌");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-[420px]">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome to Shopnex
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Sign in to continue shopping
        </p>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setTab("email");
              setStep("phone");
            }}
            className={`flex-1 py-2 rounded-lg ${
              tab === "email"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Email
          </button>

          <button
            onClick={() => {
              setTab("phone");
              setStep("phone");
            }}
            className={`flex-1 py-2 rounded-lg ${
              tab === "phone"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Phone
          </button>
        </div>

        {/* Google */}
        <button
          onClick={googleLogin}
          className="w-full border py-3 rounded-lg mb-6"
        >
          Continue with Google
        </button>

        <div className="text-center text-gray-400 mb-6">
          Or continue with
        </div>

        {/* EMAIL TAB */}
        {tab === "email" && (
          <>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4"
            />

            <button
              onClick={emailLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              Sign In with Email
            </button>
          </>
        )}

        {/* PHONE TAB */}
        {tab === "phone" && step === "phone" && (
          <>
            <input
              type="text"
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4"
            />

            <button
              onClick={sendOTP}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              Send OTP
            </button>
          </>
        )}

        {tab === "phone" && step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4"
            />

            <button
              onClick={verifyOTP}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Verify OTP
            </button>
          </>
        )}

        <p className="text-center mt-6 text-gray-500">
          Continue as Guest
        </p>

        <div id="recaptcha"></div>

      </div>
    </main>
  );
}
