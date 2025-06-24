import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { BlogModel } from '@/models/Blog';
import { jwtVerify } from '@/lib/jwt';
import { UserModel } from '@/models/User';
import { Params } from 'next/dist/server/request/params';

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const authorization = req.headers.get('Authorization');
        let authorized: boolean = false;
        let uid: any = null;

        const slug: any = await params?.slug;

        if (!slug) {
            return NextResponse.json({ error: 'missing slug params !' }, { status: 400 })
        }

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
            return NextResponse.json({ success: false, error: 'Un-Authorized' }, { status: 401 });
        }

        const blog = await BlogModel.findOne({ slug, author: uid });
        if (!blog) {
            return NextResponse.json({ error: 'Could not find the blog, please try again !' }, { status: 404 })
        }

        await blog.deleteOne()
        return NextResponse.json({ success: true, message: 'Blog deleted successfully' }, { status: 200 })

    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
