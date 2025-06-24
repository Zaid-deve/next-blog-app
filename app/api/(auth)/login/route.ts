import { connectDB } from "@/lib/mongoose";
import { UserModel } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { jwtHash } from "@/lib/jwt";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { username, password } = data;

        if (!username || !password) {
            return NextResponse.json({ error: "Username and password required" }, { status: 400 });
        }

        await connectDB();
        await UserModel.init();

        const existingUser = await UserModel.findOne({ username });

        let authorization = null;
        let error = "";

        if (existingUser) {
            const { password: digest, _id: userId } = existingUser;
            const valid = await argon2.verify(digest, password);

            if (valid) {
                authorization = await jwtHash({ userId },3600);
            } else {
                error = "Please check your password and try again!";
            }
        } else {
            const hash = await argon2.hash(password);
            const newUser = new UserModel({ username, password: hash });
            const createdUser = await newUser.save();

            authorization = await jwtHash({ userId: createdUser._id }, 3600);
        }   

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({ success: 1, authorization }, { status: 200 });
    } catch (err: any) {
        console.log(err);
        let error: any = "Something went wrong!";

        if (err.name === "ValidationError") {
            error = Object.values(err.errors).map((e: any) => e.message);
        }

        if (err.code === 11000) {
            error = "Username already exists!";
        }

        return NextResponse.json({ error }, { status: 500 });
    }
}
