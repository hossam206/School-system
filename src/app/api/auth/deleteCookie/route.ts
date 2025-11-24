import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const maxDuration = 120;

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete specific cookies
  cookieStore.delete("token");
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
