'use client';

import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import {
    Input,
} from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImageIcon, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Params } from "next/dist/server/request/params";


export const blogSchema = z.object({
    title: z.string().min(5, "Title is too short"),
    excerpt: z.string().min(10, "Excerpt is too short"),
    content: z.string().min(50, "Content too short, please add sufficient content"),
    imageUrl: z.string().min(1, { message: 'Please select an cover image for your blog' }),
    slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
    date: z.string().refine((d) => !isNaN(Date.parse(d)), { message: "Invalid date" }),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function updateBlogForm() {
    const params = useParams();
    const { slug } = params;
    const auth = useAuth();
    const router = useRouter();
    const { setLoading } = useAuth();
    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: '',
            slug: '',
            excerpt: '',
            imageUrl: '',
            content: '',
            date: new Date().toUTCString(),
            category: '',
            tags: [],
            published: true
        }
    });
    const errors = form.formState.errors

    function handleFileChange(ev: any) {
        const file = ev.target.files?.[0]
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                if (e.target?.result) {
                    form.setValue('imageUrl', e.target?.result as string);
                }
            }

            reader.readAsDataURL(file);
        }
    }

    async function onSubmit(values: any) {
        try {
            setLoading(true);
            values.currentSlug = slug;
            const req = await axios.patch('/api/blog/update', values, {
                headers: {
                    Authorization: `Bearer ${auth.authorization}`
                }
            });

            if (req.status == 200) {
                router.push('/blog/' + values.slug);
                toast.success("Blog Updated Successfully !");
                return;
            }

        } catch (e: any) {
            toast.error(e.response.data.error ?? e.message ?? 'Something went wrong !');
            if (e.status == 401) {
                router.push('/login')
            }
        } finally {
            setLoading(false);
        }
    }

    async function getBlog() {
        if (slug) {
            try {

                const req = await axios.get(`/api/blog/${slug}`, {
                    headers: {
                        Authorization: `Bearer ${auth.authorization}`
                    }
                });

                if (req.status == 200) {
                    Object.entries(req.data.data).forEach(([key, value]) => {
                        form.setValue(key as any, value)
                    })
                }

            } catch (e: any) {
                toast.error(e.response.data.error ?? e.message ?? 'Something went wrong !');
                if (e.status == 401) {
                    router.push('/login')
                }
            }
        } else {
            router.back();
        }
    }

    useEffect(() => {
        if (!auth.authorized) {
            router.push("/login")
        } else {
            getBlog();
        }
    }, [auth])

    return (
        <div className="bg-gray-200 py-10 px-10 w-screen">
            <div className="max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-5 bg-white/100 backdrop-blur-2xl rounded-2xl overflow-auto">
                <div className="space-y-4 lg:col-span-2">
                    <div>
                        <h2 className="text-2xl font-bold">Craft Your Next High-Ranking Blog Post</h2>
                        <small>Use engaging excerpts and popular keywords to boost visibility and reach.</small>
                    </div>

                    {errors.imageUrl && <p className="text-red-500 mb-3">{errors.imageUrl.message}</p>}
                    <div className={`bg-white border-3 ${errors.imageUrl ? 'border-red-400' : 'border-gray-300'} border-dashed rounded-xl`}>
                        <div className="min-h-40 relative rounded-xl">
                            <Image src={form.watch().imageUrl || '/elementor-placeholder-image.webp'} alt="blog cover image" height={300} width={1440} className="rounded-xl" />

                            <Label htmlFor="blogCoverInp" className="absolute inset-0 h-full w-full bg-white/70 items-center justify-center transition-all flex opacity-0 hover:opacity-100 cursor-pointer">
                                <div className=" max-w-md text-center">
                                    <ImageIcon size={70} className="mx-auto" />
                                    <div className="mt-6 mb-1">Add Blog Cover Image</div>
                                    <small>supported: (jpg, jpeg, png, webp, gif)</small>
                                </div>
                            </Label>

                            <input type="file" id="blogCoverInp" accept="image/*" onChange={handleFileChange} hidden />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your awesome blog title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="excerpt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Excerpt</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Short preview of the blog..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Full blog content..." className="min-h-[200px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="example-slug" {...field} />
                                        </FormControl>
                                        <FormDescription>URL-friendly version of the title</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="published"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-4">
                                        <FormLabel>Published</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="ms-auto block" size={'lg'}>Update Blog</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
