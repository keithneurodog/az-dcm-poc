import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    const sitePassword = process.env.SITE_PASSWORD

    if (!sitePassword) {
      console.error("SITE_PASSWORD environment variable is not set")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    if (password !== sitePassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      )
    }

    // Generate a simple session token
    const sessionToken = Buffer.from(
      `${Date.now()}-${Math.random().toString(36).substring(2)}`
    ).toString("base64")

    // Set the auth cookie
    const cookieStore = await cookies()
    cookieStore.set("site_auth", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}

export async function DELETE() {
  // Logout - clear the auth cookie
  const cookieStore = await cookies()
  cookieStore.delete("site_auth")

  return NextResponse.json({ success: true })
}
