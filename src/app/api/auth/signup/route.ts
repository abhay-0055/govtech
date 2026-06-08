import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as crypto from "crypto";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function hashPassword(password: string) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(salt + password).digest("hex");
  return { salt, hash };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, mobile, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { errors: { email: ["Email already registered"] } },
        { status: 409 }
      );
    }

    const { salt, hash } = hashPassword(password);

    await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        salt,
        passwordHash: hash,
        roleId: 3, // Citizen
      },
    });

    // Optional: write to audit_logs
    await prisma.auditLog.create({
      data: {
        action: "signup",
        metadata: { email },
      },
    });

    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}