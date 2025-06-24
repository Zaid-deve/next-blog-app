"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast, Toaster } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArrowRight, FileQuestion, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from 'axios';
import { useAuth } from "@/hooks/useAuth"
import { AuthProps } from "@/types/types"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }).max(24, {
        message: "Password can be max 24 characters. "
    }),
})

export default function Login() {
    const router = useRouter();
    const auth: AuthProps = useAuth();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {

            setLoading(true);

            // request login
            const req = await auth.reqLogin(data);
            if (req !== true) {
                throw new Error(req as string);
            }

        } catch (e: any) {
            setLoading(false);
            toast.warning(e.message);
        }
    }

    useEffect(() => {
        if (auth.authorized) {
            router.push('/dashboard');
        }
    }, [auth.authorized])

    return (
        <div className="flex items-center py-10 px-6 bg-gray-200 h-screen w-screen">
            <Toaster />

            <div className="max-w-md w-full mx-auto bg-white p-6 rounded-2xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="font-bold text-4xl">Login</h1>
                            <small>Welcome back, your data is safe with us !</small>
                        </div>

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} className="h-12 font-semibold" />
                                    </FormControl>
                                    <FormDescription>
                                        If no account is found, new account will be created.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" type="password" {...field} className="h-12 font-semibold" />
                                    </FormControl>
                                    <FormDescription>
                                        Tip: Creating a strong password lets your account safe from hackers.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" size={'lg'} className="flex w-full cursor-pointer ms-auto">
                            {loading && <Loader2 className="size-5 animate-spin text-blue-500" />}
                            {!loading && (
                                <>
                                    <span>Submit</span>
                                    <ArrowRight />
                                </>
                            )}
                        </Button>

                        <Button variant={'link'} className="block mx-auto text-blue-600" disabled={loading}>
                            <Link href={'./forgot'} className="flex items-center gap-2">
                                <FileQuestion /> Forgot my pasword
                            </Link>
                        </Button>
                    </form>
                </Form>
            </div>
        </div >
    )
}
