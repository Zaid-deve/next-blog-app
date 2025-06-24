'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { Button } from "@/components/ui/button";
import { Edit, Image, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { id } from "zod/v4/locales";

const profileSchema = z.object({
    username: z.string().min(4, { message: 'username too short, please choose your username between 4 to 24 characters' }),
    firstName: z.string(),
    lastName: z.string(),
    avatarUrl: z.string(),
    bio: z.string(),
    phone: z
        .string()
        .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Invalid phone number format"),
    email: z.string().email({ message: 'please enter a valid email address' }),
})

export default function Profile() {
    const auth = useAuth();
    const router = useRouter();
    const { user, setUser } = auth;
    const profileInp: any = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const form = useForm(
        {
            resolver: zodResolver(profileSchema),
            defaultValues: user ? { ...user } : {}
        }
    )
    const { setValue } = form;

    const profileData = form.watch();

    function initFileSelect() {
        profileInp.current?.click();
    }

    function readFile(file: File) {
        const reader = new FileReader();

        reader.onload = (e) => {
            if (e.target?.result) {
                setValue('avatarUrl', e.target.result as string);
            }
        }

        reader.onerror = () => toast.error('Failed to read profile image !');

        reader.readAsDataURL(file);
    }

    function handleFileChange(ev: any) {
        const file = ev.currentTarget.files;
        if (file.length) {
            if (file[0].type.includes('image')) {
                readFile(file[0]);
            } else {
                toast.error('Please select a valid profile image !');
            }
        }
    }

    async function handleUpdate() {
        try {
            setIsLoading(true);

            const req = await axios.post('/api/me/update', profileData, {
                headers: {
                    Authorization: `Bearer ${auth.authorization}`
                }
            });

            if (req.status == 200 && req.data.success) {
                toast.success('profile updated successfully !');
                setUser({ ...user, ...profileData });
                setIsEditing(false);
            }

        } catch (error: any) {
            toast.error(error.response.data.error ?? error.message ?? 'something went wrong !')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!auth.authorized) {
            router.push('/login')
        } else {
            setIsLoading(false);
        }
    }, [auth.authorized])

    useEffect(() => {
        if(user){
            Object.entries(user).forEach(([key,value]) => {
                setValue(key as any, value ?? '');
            })
        }
    }, [user])

    return (
        <div className="p-8 space-y-8 bg-gray-100 realtive min-h-screen">
            <div className={`absolute top-0 left-0 h-full w-full z-1 flex flex-col items-center justify-center bg-white ${isLoading ? '' : 'hidden'}`}>
                <div role="status">
                    <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="mt-10">Sit Still..., Something is loading...</div>
            </div>

            <div className="flex items-center gap-10 flex-wrap">
                <div className="">
                    <h1 className="text-4xl font-bold">My Profile</h1>
                    <span>view or update your profile</span>
                </div>

                <div className="ms-auto">
                    {!isEditing && (
                        <Button variant={'default'} size={'lg'} className="cursor-pointer shadow-sm" onClick={() => setIsEditing(true)}>
                            <Edit />
                            Edit Profile
                        </Button>
                    )}

                    {isEditing && (
                        <div className="flex items-center gap-3">
                            <Button variant={'destructive'} size={'lg'} className="cursor-pointer shadow-sm" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button variant={'default'} size={'lg'} className="cursor-pointer shadow-sm" type="submit" form="profileForm">
                                <Save />
                                Save Changes
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className={`grid grid-cols-1 xl:grid-cols-3 gap-8 ${isLoading && 'hidden'}`}>
                <div className="xl:col-span-1">
                    <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
                        <CardHeader>
                            <CardTitle>Profile Image</CardTitle>
                            <CardDescription>Visibile To Everyone</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Avatar className="w-32 h-32 border-4 border-gradient-to-br from-blue-500 to-purple-600 mx-auto">
                                <AvatarImage src={`${profileData.avatarUrl}`} alt="Profile" />
                                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    {profileData?.firstName?.[0]}{profileData?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        </CardContent>
                        <CardFooter>
                            <input type="file" ref={profileInp} accept="image/*" onChange={handleFileChange} hidden />
                            {
                                isEditing && (
                                    <Button variant={'default'} size={'lg'} className="cursor-pointer shadow-sm mx-auto" onClick={initFileSelect}>
                                        <Image />
                                        Browse Profile
                                    </Button>
                                )
                            }
                        </CardFooter>
                    </Card>
                </div>

                <div className="xl:col-span-2">
                    <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-8" id="profileForm">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="username"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="username">Username</FormLabel>
                                                        <FormControl>
                                                            <div>
                                                                {!isEditing && (
                                                                    <div className="w-full px-3 py-2 rounded-md bg-gray-100 font-medium text-gray-900">
                                                                        @{profileData.username}
                                                                    </div>
                                                                )}
                                                                {isEditing && <Input placeholder="Enter Username" {...field} />}
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>
                                                            This is your public display name.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>

                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="email">Email Address</FormLabel>
                                                        <FormControl>
                                                            <div>
                                                                {!isEditing && (
                                                                    <div className="w-full px-3 py-2 rounded-md bg-gray-100 font-medium text-gray-900">
                                                                        {profileData.email}
                                                                    </div>
                                                                )}
                                                                {isEditing && <Input placeholder="Enter Email Address" {...field} />}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>

                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="fname">First Name</FormLabel>
                                                        <FormControl>
                                                            <div>
                                                                {!isEditing && (
                                                                    <div className="w-full px-3 py-2 rounded-md bg-gray-100 font-medium text-gray-900">
                                                                        {profileData.firstName}
                                                                    </div>
                                                                )}
                                                                {isEditing && <Input placeholder="Enter Email Address" {...field} />}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>

                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="fname">Last Name</FormLabel>
                                                        <FormControl>
                                                            <div>
                                                                {!isEditing && (
                                                                    <div className="w-full px-3 py-2 rounded-md bg-gray-100 font-medium text-gray-900">
                                                                        {profileData.lastName}
                                                                    </div>
                                                                )}
                                                                {isEditing && <Input placeholder="Enter Email Address" {...field} />}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>

                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="email">Phone Number</FormLabel>
                                                        <FormControl>
                                                            <div>
                                                                {!isEditing && (
                                                                    <div className="w-full px-3 py-2 rounded-md bg-gray-100 font-medium text-gray-900">
                                                                        {profileData.phone}
                                                                    </div>
                                                                )}
                                                                {isEditing && <Input placeholder="Enter Your Phone" {...field} />}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="md:col-span-4">
                                            <FormField
                                                control={form.control}
                                                name="bio"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="email">Bio (About yourself)</FormLabel>
                                                        <FormControl>
                                                            <div>
                                                                {!isEditing && (
                                                                    <div className="w-full px-3 py-2 rounded-md bg-gray-100 font-medium text-gray-900 h-40 overflow-y-auto">
                                                                        {profileData.bio}
                                                                    </div>
                                                                )}
                                                                {isEditing && <Textarea rows={20} placeholder="Enter About Yourself In Brief" {...field} />}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}