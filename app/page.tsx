'use client';

import Blogs from "@/components/blog/Blogs";
import BlogLoading from "@/components/blog/Loader";
import Navbar from "@/components/layout/Navbar";
import { SearchBar } from "@/components/SearchBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios";
import { useEffect, useState } from "react";
import { BlogsResponse, PaginationProps } from '@/types/types'
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const params = useSearchParams();
  const page = (params.get('page') ?? 1) as number;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BlogsResponse>({
    success: false,
    data: { blogs: [] },
    pagination: {
      page,
      totalPages: 0,
      total: 0,
      limit: 15
    }
  })

  const [filters, setFilters] = useState({
    search: '',
    filter: ''
  })

  async function getBlogs() {
    try {

      if (!loading) setLoading(true)
      const { search, filter } = filters;
      const params = `page=${data.pagination?.page ?? 1}&limit=${data.pagination?.limit ?? 5}&search=${search}&filter=${filter}`

      const req = await axios.get(`/api/blogs?${params}`)
      if (req.status == 200 && req.data.success) {
        setData(req.data);
      }
    } catch (err: any) {
      toast.error(err.response.data.error ?? err.message ?? 'Something went wrong !')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBlogs();
  }, [filters.search, data.pagination?.page])

  useEffect(() => {
    getBlogs();
  }, [filters.filter])

  return (
    <>
      <Navbar />
      <div className="max-w-7xl p-10 mx-auto">
        {!loading ? (
          <>
            <div className="mb-5 flex justify-between gap-10 items-center flex-wrap">
              <div className="max-w-lg w-full">
                <SearchBar search={filters.search} setSearch={(search: string) => setFilters({ ...filters, search })} />
              </div>
              <div>
                <Select onValueChange={(value) => setFilters({ ...filters, filter: value })} defaultValue={filters.filter || 'newest'}>
                  <SelectTrigger className="w-[180px] min-h-10">
                    <SelectValue placeholder="Latest Blogs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest To Oldest</SelectItem>
                    <SelectItem value="oldest">Oldest To Newest</SelectItem>
                    <SelectItem value="most_viwed">Most Viewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-10">
              <div className="mb-10">
                <h1 className="text-primary text-4xl font-bold ">All Blogs</h1>
                <div className="text-xs mt-3">Showing {`${data?.pagination?.page ?? 0}`} of {`${data?.pagination?.total ?? 0}`} blogs</div>
              </div>
              <Blogs search={filters.search} blogs={data.data.blogs} pagination={data.pagination as PaginationProps} />
            </div>
          </>
        ) : (
          <BlogLoading />
        )}
      </div>
    </>
  )
}