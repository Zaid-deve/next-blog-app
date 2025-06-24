import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { BlogModel } from '@/models/Blog';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get search params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') ?? '';
    const sortBy = searchParams.get("filter") || "newest";

    const skip = (page - 1) * limit;

    const filter: any = {
      published: true,
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }, // adjust field names as needed
      ];
    }

    let sort: Record<string, 1 | -1> = { date: -1 }; // newest default

    if (sortBy === "oldest") {
      sort = { date: 1 };
    } else if (sortBy === "most_viewed") {
      sort = { views: -1 };
    }

    const [blogs, total] = await Promise.all([
      BlogModel.find(filter).skip(skip).limit(limit).sort(sort),
      BlogModel.countDocuments(filter),
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
