import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Ensure the Firebase Admin SDK is initialized only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    // Verify the Firebase token (checks if OTP verification was valid)
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // You can create or fetch the user from your database here if needed
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      user: decodedToken,
    });
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
