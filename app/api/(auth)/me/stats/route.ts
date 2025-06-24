import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { BlogModel } from '@/models/Blog';
import { jwtVerify } from '@/lib/jwt';
import { UserModel } from '@/models/User';
import { DashboardStats } from '@/types/types';

export async function GET(req: NextRequest) {
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

        const blogs = await BlogModel.countDocuments({ author: uid }) ?? 0;
        const revenue = 0;
        const result = await BlogModel.aggregate([
            { $match: { author: uid } },
            {
                $group: {
                    _id: null,
                    views: { $sum: "$views" }
                }
            }
        ]);

        const views = result[0]?.views ?? 0;
        const growth = 100;

        const data: DashboardStats = { views, blogs, growth, revenue, activity: [] }

        return NextResponse.json({ success: true, data }, { status: 200 })

    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
