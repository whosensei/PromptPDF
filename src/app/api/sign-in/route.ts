import { signinSchema } from "@/lib/zod";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { user } from "@/lib/db/schema";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = signinSchema.parse(body);
        const { email, password } = data;

        const existingUser = await db.query.user.findFirst({
            where: eq(user.email, email)
        });

        if (!existingUser) {
            return NextResponse.json({
                message: "Invalid credentials"
            }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        
        if (!isPasswordValid) {
            return NextResponse.json({
                message: "Invalid password"
            }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: existingUser.id },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "24h" }
        );

        return NextResponse.json({
            message: "User signed in successfully",
            token,
            user: {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Sign in error:", error);
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 });
    }
}