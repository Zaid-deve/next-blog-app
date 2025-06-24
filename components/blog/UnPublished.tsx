import { ArrowLeft, CheckCircle2Icon, Clock10Icon, ClockIcon, SaveIcon } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Button } from "../ui/button";
import Link from "next/link";

export default function UnpublishedNotice() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
            <div className="max-w-md space-y-6">
                <div className="flex justify-center">
                    <Clock10Icon className="w-30 h-30 text-shadow-yellow-100" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    This Blog Post Isn't Published Yet
                </h1>
                <hr />
                <Alert className="text-start bg-amber-100">
                    <CheckCircle2Icon />
                    <AlertTitle>Check after some time</AlertTitle>
                    <AlertDescription>
                        The author is still working on this post. Once it's published, it will appear here.
                    </AlertDescription>
                </Alert>

                <Link href='/'>
                    <Button size={'lg'} variant={'link'} className="px-12 cursor-pointer">
                        <ArrowLeft />
                        <span>Go To Blogs</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
