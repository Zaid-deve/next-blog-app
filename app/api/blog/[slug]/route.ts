import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { BlogModel } from '@/models/Blog';
import { UserModel } from '@/models/User';
import { jwtVerify } from '@/lib/jwt';

export async function GET(req: NextRequest, { params }: any) {
    try {
        const authorization = req.headers.get('Authorization');
        let authorized: boolean = false;
        let uid: any = null;

        if (authorization) {
            const token = authorization.split(' ')[1];
            if (token) {
                const data: any = await jwtVerify(token);
                if (data) {
                    uid = data.userId;
                    await connectDB();
                    const user = await UserModel.exists({ _id: uid });
                    if (user) {
                        authorized = true;
                    }
                }
            }
        }

        if (!authorized) {
            await connectDB();
        }


        // Get search params
        const slug = await params?.slug;
        if (!slug) {
            return NextResponse.json({ success: false, error: 'parameter slug missing' }, { status: 404 });
        }

        const blog = await BlogModel.findOne({ slug }, { _id: 0, _v: 0 });
        const author = await UserModel.findOne({ _id: blog.author }, { _id: 0, firstName: 1, lastName: 1, usename: 1 });

        if (!blog.published) {
            if (!authorized || blog.author != uid) {
                return NextResponse.json({ success: true, isDraft:true, error: 'blog is not published yet !' }, { status: 200 });
            }
        }


        return NextResponse.json({
            success: true,
            data: { ...(blog.toObject()), author }
        }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
