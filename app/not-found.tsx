import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// app/not-found.tsx
export default function NotFound() {
    return (
        <div className="h-screen flex items-center justify-center flex-col text-center font-semibold">
            <Image src={'/search-no-result-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg'} height={200} width={300} alt="404 - not found"></Image>
            <h1 className="text-4xl font-bold text-destructive">404 – Page Not Found</h1>
            <p className="text-muted-foreground mt-2">Sorry, the page you are looking for doesn't exist.</p>
            <Link href='/' className="mt-5">
                <Button variant={'default'} size={'lg'} className="cursor-pointer font-bold">
                    <ArrowLeft />
                    Back to home
                </Button>
            </Link>
        </div>
    );
}
