import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { BlogModel } from '@/models/Blog';
import { jwtVerify } from '@/lib/jwt';
import { UserModel } from '@/models/User';

export async function POST(req: NextRequest) {
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
            return NextResponse.json({ success: false, error: 'Un-Authorized' }, { status: 401 });
        }

        // Get search params
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        const skip = (page - 1) * limit;

        const [blogs, total] = await Promise.all([
            BlogModel.find({ author: uid }).skip(skip).limit(limit).sort({ date: -1 }),
            BlogModel.countDocuments()
        ]);

        return NextResponse.json({
            success: true,
            data: { blogs },
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
