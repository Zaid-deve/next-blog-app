import { BlogCard } from "./Blog";
import { PaginationBlock } from "../Pagination";
import { BlogPost, PaginationProps } from "@/types/types";
import { NoBlogsFound } from "./NoBlogs";

export default function Blogs({ search, blogs, pagination }: { search: string, blogs: BlogPost[], pagination: PaginationProps }) {
    return (
        <>
            {!Object.entries(blogs || {}).length && <NoBlogsFound message={search && 'No result found for: ' + search} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6">
                {blogs.map((blog: BlogPost) => (
                    <BlogCard key={blog.slug} post={blog} />
                ))}
            </div>

            <div className="mt-10">
                <PaginationBlock pagination={pagination} />
            </div>
        </>
    )
}