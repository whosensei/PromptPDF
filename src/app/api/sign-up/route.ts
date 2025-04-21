import { user } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signUpSchema } from "@/lib/zod";
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = signUpSchema.parse(body);
        const { email, username, password } = data

        const existingUser = await db.query.user.findFirst({
            where: eq(user.email, email)
        })
        if (existingUser) {
            return NextResponse.json({
                message: "Email already exists"
            }, { status: 401 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const result = await db.insert(user).values({
            email,
            username,
            password: hashedPassword
        }).returning({ id: user.id });

        const userId = result[0].id;

        const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "24h" }
        );

        return NextResponse.json({
            message: "User signed up successfully",
            token,
        }, { status: 201 });
    } catch (e) {
        console.error("Sign up error:", e);
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 })
    }
}