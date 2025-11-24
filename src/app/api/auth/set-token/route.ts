import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    // Set HttpOnly token cookie
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return NextResponse.json({
      success: true,
      message: "Token set successfully",
    });
  } catch (error) {
    console.error("Error setting token:", error);
    return NextResponse.json(
      { success: false, message: "Failed to set token" },
      { status: 500 }
    );
  }
}
