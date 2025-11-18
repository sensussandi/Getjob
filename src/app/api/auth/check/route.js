import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const token = cookies().get("mahasiswa_token")?.value;

    if (!token) {
      return NextResponse.json({ loggedIn: false });
    }

    const data = jwt.verify(token, "SECRET_JWT");

    return NextResponse.json({
      loggedIn: true,
      data,
    });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
