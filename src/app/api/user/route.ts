import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({
                message: "Not authenticated"
            }, { status: 401 });
        }
        
        const secret = process.env.JWT_SECRET || "fallback_secret";
        const decoded = jwt.verify(token, secret) as { userId: string };
        
        return NextResponse.json({
            userId: decoded.userId
        }, { status: 200 });
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json({
            message: "Invalid or expired token"
        }, { status: 401 });
    }
} 