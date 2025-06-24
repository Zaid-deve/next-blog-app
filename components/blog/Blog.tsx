import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { BlogPost } from "@/types/types"
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { EyeIcon } from "lucide-react";
import { timeAgo } from "@/lib/functions";

export function BlogCard({ post }: { post: BlogPost }) {

    const { slug, imageUrl, title, excerpt, date } = post;

    return (
        <Card className="w-full max-w-md hover:shadow-lg transition-shadow p-0">
            <Link href={`/blog/${slug}`}>
                <CardHeader className="p-0">
                    <Image
                        src={imageUrl ?? '/pngtree-colorful-blog-speech-bubble-vector-png-image_6633021.png'}
                        alt={title}
                        width={400}
                        height={200}
                        className="rounded-t-md w-full object-cover object-center aspect-square"
                    />
                </CardHeader>
                <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2">{title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{excerpt}</p>
                </CardContent>
                <CardFooter className="px-4 pb-4">
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-xs text-muted-foreground">{timeAgo(date)}</span>
                        <div className="ms-auto">
                            <Button variant={'default'} size={'sm'} className="cursor-pointer">
                                <EyeIcon />
                                View Blog
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Link>
        </Card>
    )
}
