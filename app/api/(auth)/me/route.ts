import { jwtVerify } from "@/lib/jwt";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const authorization = req.headers.get('Authorization');

        if (authorization) {
            const token = authorization.split(' ')[1];
            if (token) {
                const data = await jwtVerify(token);
                if (data) {
                    const { userId }: any = data;
                    await connectDB();
                    const user = await UserModel.findById(userId, { username: 1, avatarUrl: 1, firstName: 1, lastName: 1, phone: 1, email: 1, createdAt: 1, _id: 0 });
                    if (user) {
                        return NextResponse.json({ success: true, user }, { status: 200 });
                    }
                }
            }
        }

        return NextResponse.json({ success: false, error: 'Un-Authorized' }, { status: 401 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }

}