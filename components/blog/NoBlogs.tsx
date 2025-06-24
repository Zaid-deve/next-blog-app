import { Button } from "@/components/ui/button";
import { BoxIcon, Citrus, Plus } from "lucide-react";
import Link from "next/link";

export function NoBlogsFound({ message }: any) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center font-semibold">
            <Citrus className="w-26 h-26 mb-8 text-green-900" />
            <h2 className="text-2xl font-semibold mb-2">{message ? message : 'No blogs at the moment'}</h2>
            <p className="mb-6 max-w-md text-sm text-muted-foreground">
                It looks like there are no blog posts available at the moment. Once blogs are added, they'll appear here.
            </p>
            <Link href={'/blog/new'}>
                <Button className="cursor-pointer" size={'lg'}>
                    <Plus />
                    Create your first blog
                </Button>
            </Link>
        </div>
    );
}
