# 📝 Next.js Blog Platform

A full-featured modern blog platform built with **Next.js (App Router)**, **MongoDB**, and **TypeScript**, featuring full REST API, authentication, SEO-friendly content, dynamic image handling, and smooth UX with ShadCN UI.

---

## 🚀 Features

- ⚙️ **Next.js 14+ App Router**
- 📦 **MongoDB + Mongoose Models**
- 🔒 **JWT Authentication**
- 🖼️ **Base64 Image Upload & Storage**
- 📄 **Markdown/HTML Content Editor**
- 🔍 **Live Search with Debounce**
- 🏷️ **Filters by Category, Tags, and Popularity**
- 📈 **View Count & Analytics**
- ⏳ **Pagination with Dynamic Pages**
- 🌐 **SEO-Ready Blog Posts**
- 💬 **Blog Drafting & Publishing Workflow**
- 🎨 **ShadCN UI + Lucide Icons**
- 📱 **Responsive & Mobile Friendly**
- 🧪 **API Route Support for CRUD**

---

## 📁 Folder Structure

```
/app
  /api/blogs     → REST API for blog CRUD
  /(pages)       → Frontend routes
/components      → Reusable UI components
/lib             → Utility functions (e.g., jwt, db)
/models          → Mongoose models (User, Blog)
public           → Static assets
```

---

## 🔧 Setup

1. **Clone the repo**

```bash
git clone https://github.com/Zaid-deve/next-blog-app
cd next-blog-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure `.env.local`**

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. **Run the dev server**

```bash
npm run dev
```

Visit `http://localhost:3000` 🚀

---

## 🔌 API Endpoints

- `POST /api/login` → Login user
- `GET /api/blogs` → Fetch blogs (with search, pagination, filter)
- `POST /api/blog/new` → Create new blog post
- `PATCH /api/blog/update` → Update a blog post
- `DELETE /api/blog/delete` → Delete a blog

---

## 📸 Image Upload

- Accepts base64 strings from rich editor or uploader
- Stores image in server folder (e.g., `/public/uploads`)
- Automatically generates a clean file name and path

---

## 📄 Example Blog Object

```json
{
  "title": "How to Build a Blog in 2025",
  "excerpt": "Modern guide to building SEO-friendly blogs.",
  "content": "<p>Welcome to the future of blogging...</p>",
  "imageUrl": "/cover/build-blog-2025.png",
  "slug": "build-blog-2025",
  "tags": ["Next.js", "Blog", "Guide"],
  "category": "Development",
  "published": true
}
```

---

## 📌 TODO / Future Improvements

- [ ] Add comment system
- [ ] Integrate rich text editor
- [ ] Enable server-side image optimization
- [ ] RSS feed generation
- [ ] Admin dashboard for managing users/blogs

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ by [Zaid patel](https://github.com/Zaid-deve)