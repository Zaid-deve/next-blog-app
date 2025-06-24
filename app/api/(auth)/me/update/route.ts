import { jwtVerify } from "@/lib/jwt";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { saveFile } from "@/lib/actions";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
    try {
        const authorization = req.headers.get('Authorization');
        const payload: any = await req.json();

        if (authorization) {
            const token = authorization.split(' ')[1];
            if (token) {
                const data = await jwtVerify(token);
                if (data) {
                    const { userId }: any = data;
                    await connectDB();
                    const user = await UserModel.findById(userId, { password: 1 });
                    if (user) {

                        const { avatarUrl = null } = payload;
                        if (avatarUrl) {
                            const url = await saveFile(avatarUrl, 'avatars')
                            payload.avatarUrl = url;
                        }

                        const update = await UserModel.findByIdAndUpdate(userId,
                            { $set: { ...payload, password: user.password } },
                            { strict: false, runValidators: true },
                        )

                        if (update) {
                            return NextResponse.json({ success: true }, { status: 200 });
                        }
                    }
                }
            }
        }

        return NextResponse.json({ success: false, error: 'Un-Authorized' }, { status: 401 });
    } catch (err: any) {
        console.log(err);

        let error: any = "Something went wrong!";

        if (err.name === "ValidationError") {
            error = Object.values(err.errors).map((e: any) => e.message);
        }

        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyPattern)[0];
            error = `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists!`;
        }

        return NextResponse.json({ error }, { status: 400 });
    }

}