// types/user

export type User = {
  username: string,
  avatarUrl?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
  bio?: string,
  createdAt?: string
}

// types/blog

export type BlogPost = {
  id: string;                // unique identifier (UUID or slug)
  title: string;             // blog title
  excerpt: string;           // short preview
  content: string;           // full content (Markdown, HTML, or plain text)
  imageUrl: string;          // cover image
  slug: string;              // URL path, like "how-to-use-shadcn"
  date: string;              // ISO string or formatted date
  author?: User;             // author info
  tags?: string[];           // optional tags like ['nextjs', 'shadcn']
  category?: string;         // optional blog category
  published?: boolean;       // show/hide in list
  views: number
};


// types/Auth provider

export type AuthProps = {
  authorized: boolean,
  authorization?: string,
  user?: User,
  reqLogin: (data: any) => Promise<string | boolean>,
  setToken: (token: string) => void,
  setUser: (data: User) => void,
  logout: () => void,
  setLoading: (state: any) => any
}

// pagination 

export type PaginationProps = {
  page: number;
  totalPages: number;
  limit: number;
  total?: number;
  basePath?: string;
};

// types/blogsResponse
export type BlogsResponse =
  {
    success: boolean;
    data: {
      blogs: BlogPost[];
    };
    pagination?: PaginationProps
  }


// activity
export type Activity = {
  message: String,
  date: any
}


// dashboard stats
export type DashboardStats = {
  views: Number,
  growth: Number,
  revenue: Number,
  blogs: Number,
  activity?: Activity[]
}