'use client';

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import {
    TwitterIcon,
    FacebookIcon,
    LinkedinIcon,
    MessageCircleIcon,
    CopyIcon,
    Share2Icon,
    CrosshairIcon,
    CrossIcon,
    ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';

interface BlogShareAlertDialogProps {
    url: string;
    title?: string;
}

export function ShareBlog({ url, title = 'Check out this blog post!' }: BlogShareAlertDialogProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <Share2Icon className="w-4 h-4 mr-2" />
                    Share
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Share this blog</AlertDialogTitle>
                    <AlertDialogDescription>
                        Share on your favorite platform or copy the link below.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid grid-cols-2 gap-3 py-4">
                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition"
                    >
                        <TwitterIcon className="w-5 h-5" />
                        Twitter
                    </a>

                    <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition"
                    >
                        <MessageCircleIcon className="w-5 h-5" />
                        WhatsApp
                    </a>

                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition"
                    >
                        <LinkedinIcon className="w-5 h-5" />
                        LinkedIn
                    </a>

                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition"
                    >
                        <FacebookIcon className="w-5 h-5" />
                        Facebook
                    </a>
                </div>


                <AlertDialogFooter className="flex flex-col gap-2 items-center justify-between">
                    <AlertDialogCancel className='me-auto cursor-pointer bg-gray-200 px-4 py-2 rounded flex items-center gap-3'>
                        <ArrowLeft className='h-5 w-5'/>
                        Close
                    </AlertDialogCancel>
                    <Button variant={'ghost'}
                        onClick={handleCopy}
                        size={'lg'}
                        className='cursor-pointer'
                    >
                        <CopyIcon className="w-4 h-4" />
                        {copied ? 'Link copied!' : 'Copy link'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
