import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as crypto from "crypto";

function hashWithSalt(salt: string, password: string) {
  return crypto.createHash("sha256").update(salt + password).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || hashWithSalt(user.salt, password) !== user.passwordHash) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // JWT issuing comes in P1-06 — for now just confirm login works
    return NextResponse.json({
      message: "Login successful",
      user: { id: user.userId, name: user.name, email: user.email, role: user.role.roleName },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}