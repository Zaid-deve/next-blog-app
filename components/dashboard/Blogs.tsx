'use client';
import { useAuth } from "@/hooks/useAuth";
import { timeAgo } from "@/lib/functions";
import { BlogPost, BlogsResponse, PaginationProps } from "@/types/types";
import axios from "axios";
import { Edit, Plus, Trash2, ViewIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NoBlogsFound } from "../blog/NoBlogs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PaginationBlock } from "@/components/Pagination";

// Modern blogs content with enhanced UI
export const BlogsContent = () => {
    const params = useSearchParams();
    const [data, setData] = useState<BlogsResponse>({
        success: false,
        data: { blogs: [] },
        pagination: {
            page: (params.get('page') ?? 1) as number,
            limit: 1,
            totalPages: 0,
            total: 0,
            basePath: '/dashboard'
        }
    });
    const router = useRouter();
    const auth = useAuth();

    async function fetchBlogs() {
        try {
            const query = `page=${data.pagination?.page ?? 1}&limit=${data.pagination?.limit ?? 10}`
            const req = await axios.post(`/api/me/blogs?${query}`, null, {
                headers: {
                    Authorization: `Bearer ${auth.authorization}`
                }
            });
            if (req.status == 200 && req.data) {
                req.data.pagination.basePath = '/dashboard';
                setData(req.data);
            }
        } catch (error: any) {
            if (error.response.status == 401) {
                auth.logout()
                router.push('/login')
            }
            toast.error('Something went wrong !');
        }
    }

    async function deleteBlog(slug: string) {
        try {
            const req = await axios.delete(`/api/me/blogs/delete/${slug}`, {
                headers: {
                    Authorization: `Bearer ${auth.authorization}`
                }
            });
            if (req.status == 200) {
                toast.success('Blog Deleted Successfully !')
                const blogs: BlogPost[] = (data?.data.blogs ?? []).filter(blog => blog.slug != slug);

                setData({ ...data, data: { blogs } } as BlogsResponse);
            }
        } catch (error: any) {
            if (error.response.status == 401) {
                auth.logout()
                router.push('/login')
            }
            toast.error('Something went wrong !');
        }
    }

    useEffect(() => {

        (async () => {

            if (auth.authorized) {
                await fetchBlogs();
            } else {
                router.push("/login");
            }

        })()

    }, [auth])

    return <div className="p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Blog Management
                </h1>
                <p className="text-xl text-gray-600 font-medium mt-2">Create and manage your content</p>
            </div>
            <Link href={'/blog/new'} className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                <Plus className="w-5 h-5" />
                <span>New Post</span>
            </Link>
        </div>

        <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
                <h3 className="text-xl font-bold text-white">Recent Posts</h3>
            </div>

            <div className="divide-y divide-gray-100">
                {(!data?.data?.blogs) && <NoBlogsFound />}
                {(data?.data?.blogs ?? []).map((post, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50/80 transition-all duration-200 group">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                                        {post.title}
                                    </h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${post.published
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-3 font-medium">{post.excerpt}</p>
                                <span className="text-sm font-semibold text-gray-500">{timeAgo(post.date)}</span>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                                <Link href={`/blog/${post.slug}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="view blog">
                                    <ViewIcon className="w-4 h-4" />
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="delete blog">
                                        <Trash2 className="w-4 h-4" />
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteBlog(post.slug)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <Link href={`/blog/edit/${post.slug}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="edit blog">
                                    <Edit className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
        <PaginationBlock pagination={data.pagination as PaginationProps} />
    </div>
};