import { jwtVerify } from "@/lib/jwt";
import { UserModel } from "@/models/User";
import { connectDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { BlogModel } from "@/models/Blog";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { saveFile } from "@/lib/actions";
import { randomUUID } from "crypto";
import { isBase64Image } from "@/lib/functions";

export async function POST(req: NextRequest) {
    try {
        const authorization = req.headers.get('Authorization');
        const payload = await req.json();
        const { slug, imageUrl } = payload;

        if (authorization) {
            const token = authorization.split(' ')[1];
            if (token) {
                const data = await jwtVerify(token);
                if (data) {
                    const { userId }: any = data;
                    await connectDB();
                    const user = await UserModel.findById(userId);
                    if (user) {
                        payload.author = user._id;

                        const exists = await BlogModel.exists({ slug })
                        if (exists) {
                            return NextResponse.json({ success: false, error: `Blog with '${slug}' already exists !` }, { status: 400 });
                        }

                        // upload image
                        if (isBase64Image(imageUrl)) {
                            const filePath = await saveFile(imageUrl, 'covers');
                            payload.imageUrl = filePath;
                        }

                        // current date
                        payload.date = new Date().toUTCString()

                        const blog = new BlogModel(payload);
                        if (await blog.save()) {
                            return NextResponse.json({ success: true }, { status: 201 });
                        }
                    }
                } else {
                    return NextResponse.json({ success: false, error: 'Un-Authorized' }, { status: 401 });
                }
            }
        }

        return NextResponse.json({ success: false, error: 'Something Went Wrong' }, { status: 400 });
    } catch (err: any) {
        console.log(err);
        let error: any = "Something went wrong!";

        if (err.name === "ValidationError") {
            error = Object.values(err.errors).map((e: any) => e.message);
        }

        if (err.code === 11000) {
            error = "Username already exists!";
        }

        return NextResponse.json({ error }, { status: 400 });
    }

}