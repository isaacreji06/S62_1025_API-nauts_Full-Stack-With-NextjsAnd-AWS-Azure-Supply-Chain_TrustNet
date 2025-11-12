// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // IMPORTANT: preserve newline characters
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ success: false, message: "Missing token" }, { status: 400 });

    const decoded = await admin.auth().verifyIdToken(idToken);
    // decoded contains uid, phone_number, email, etc.
    // Here: create or fetch a user in your DB, create app session cookie/jwt if desired.

    return NextResponse.json({ success: true, user: decoded });
  } catch (err: any) {
    console.error("verify-otp error", err);
    return NextResponse.json({ success: false, message: err.message || "Verification failed" }, { status: 401 });
  }
}
