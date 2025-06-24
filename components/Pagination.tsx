import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationProps } from "@/types/types";

export function PaginationBlock({ pagination }: { pagination: PaginationProps }) {
    const { page, totalPages, limit, basePath } = pagination
    const getPageLink = (p: number) => `${basePath ?? '/'}?page=${p}`;

    const renderPages = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || i === totalPages || Math.abs(i - page) <= 1
            ) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink href={getPageLink(i)} isActive={i === page}>
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            } else if (i === page - 2 || i === page + 2) {
                pages.push(
                    <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
        }

        return pages;
    };

    return (
        <Pagination className="mt-6">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={getPageLink(page - 1)}
                        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {renderPages()}

                <PaginationItem>
                    <PaginationNext
                        href={getPageLink(page + 1)}
                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
