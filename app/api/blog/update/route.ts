import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { BlogModel } from '@/models/Blog';
import { UserModel } from '@/models/User';
import { jwtVerify } from '@/lib/jwt';
import { saveFile } from '@/lib/actions';

function isBase64Image(data: string): boolean {
    return /^data:image\/[a-zA-Z]+;base64,/.test(data);
}

export async function PATCH(req: NextRequest) {
    try {
        const authorization = req.headers.get('Authorization');
        const data = await req.json();
        const { currentSlug: slug, imageUrl } = data;
        let authorized = false;
        let uid: string | null = null;

        // Auth check
        if (authorization) {
            const token = authorization.split(' ')[1];
            if (token) {
                const decoded: any = await jwtVerify(token);
                if (decoded) {
                    uid = decoded.userId;
                    await connectDB();
                    const user = await UserModel.exists({ _id: uid });
                    if (user) {
                        authorized = true;
                    }
                }
            }
        }

        if (!authorized) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
        }

        // Blog check
        const blog = await BlogModel.findOne({ slug });
        if (!blog) {
            return NextResponse.json({ error: 'The blog could not be found' }, { status: 404 });
        }

        if (blog.author.toString() !== uid) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
        }

        // Check if imageUrl is a base64 string and save it
        if (imageUrl && isBase64Image(imageUrl)) {
            const savedPath = await saveFile(imageUrl, 'covers');
            data.imageUrl = savedPath;
        }

        // Update blog
        delete data.currentSlug;
        delete data.author;
        
        blog.set({ ...blog.toObject(), ...data });
        await blog.save();

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
