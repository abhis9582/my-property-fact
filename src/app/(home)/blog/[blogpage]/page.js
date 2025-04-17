import BlogDetail from "./blogpage";
export default function BlogPage({ params }) {
    const { blogpage } = params;

    return <BlogDetail slug={blogpage} />
}