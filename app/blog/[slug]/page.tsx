import { ShareBlog } from "@/components/blog/Share";
import UnpublishedNotice from "@/components/blog/UnPublished";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/functions";
import { BlogModel } from "@/models/Blog";
import { BlogPost } from "@/types/types";
import axios from "axios";
import { Calendar, EyeIcon, ShareIcon, StarIcon, User2 } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export default async function BlogPage({ params }: any) {
    const slug = await params.slug;

    let post: any = {};
    let isDraft: boolean = false;

    try {
        const req = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/blog/${slug}`)
        if (req.status == 200 && req.data.success) {

            if (req.data.isDraft) {
                isDraft = true;
            } else {
                post = req.data.data as BlogPost;
            }

        }
    } catch (error) {
        redirect('/not-found');
    }

    async function updateViews() {
        const blog = await BlogModel.findOne({ slug });
        blog.set({ views: blog.views + 1 })
        await blog.save();
    }

    if (isDraft) {
        return <UnpublishedNotice />
    } else {
        await updateViews();
    }

    return (
        <div className="flex">
            <div className="max-w-7xl w-full mx-auto p-10">
                <div className="mb-10">
                    <Image src={post.imageUrl} height={200} width={1000} className="object-contain object-center mx-auto rounded-xl" alt="Blog Cover" />
                </div>

                <div className="flex items-center justify-end font-bold gap-5">
                    <Button>
                        <StarIcon />
                        Add to favorites
                    </Button>
                    <ShareBlog url={`${process.env.NEXT_PUBLIC_URL}/blog/${slug}`} title={post.title} />
                </div>

                <div className="my-10">
                    <h1 className="font-bold text-4xl">{post.title}</h1>
                </div>

                <div className="flex flex-col gap-3 prose prose-neutral dark:prose-invert">
                    <div className="flex gap-2 items-center"><Calendar size={20} /> {timeAgo(post.date)}</div>
                    <div className="flex gap-2 items-center"><User2 size={20} /> {(post.author.firstName + ' ' + post.author.lastName) || post.author.username}</div>
                    <div className="flex gap-2 items-center"><EyeIcon size={20} /> {post.views}</div>
                </div>

                <div className="mt-8 pt-6 border-t-2 ">
                    <ReactMarkdown>
                        {post.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )

}