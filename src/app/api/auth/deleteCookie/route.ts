import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const maxDuration = 120;

// The API's auth cookies are httpOnly, so the browser's JS can't delete them.
// They live on this app's origin (the API is proxied through /api/v1), so this
// route can expire them. The attributes match how the API sets them.
const AUTH_COOKIES = ["accessToken", "refreshToken"];

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete specific cookies
    cookieStore.delete("token");
    for (const name of AUTH_COOKIES) {
      cookieStore.set(name, "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }
    // Return a success response
    return NextResponse.json(
      { success: true, message: "Cookies deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting cookies:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete cookies" },
      { status: 500 }
    );
  }
}
