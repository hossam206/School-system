import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const response = NextResponse.json({
      success: true,
      data: {
        isAuthenticated: !!token,
        tokenExists: !!token,
      },
    });

     response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    return response;
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error checking auth status",
      data: {
        isAuthenticated: false,
        hasProfileCompleted: false,
        tokenExists: false,
      },
    });
  }
}
