import Image from "next/image";
import Link from "next/link";
import './common.css';
export default function BlogCard({ blog }) {

    const truncateWords = (text, wordLimit) => {
        const words = text.trim().split(/\s+/);
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(" ") + " ...";
    };

    const truncateTitle = (text, wordLimit) => {
        const title = text.replace(/\u00A0/g, ' ');
        const words = title.split(" ");
        if (words.length <= wordLimit) return title;
        return words.slice(0, wordLimit).join(" ") + "...";
    }

    return (
        <>
            <Link href={`/blog/${blog.slugUrl}`}
                className="card border-0 rounded-3 overflow-hidden custom-shadow blog-card my-3 text-decoration-none"
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                <Image
                    width={1200}
                    height={628}
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}blog/${blog.blogImage}`}
                    alt={blog.blogTitle}
                    className="img-fluid"
                    
                />
                <div className="card-body d-flex flex-column">
                    <p className="blog-date">{new Date(blog.createdAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        // timeStyle: 'short'
                    })}</p>
                    <h4 className="card-title fw-bold" title={blog.blogTitle}>{truncateTitle(blog.blogTitle, 8)}</h4>

                    <div className="flex-grow-1 mb-3">
                        <p className="card-text text-muted small">
                            {truncateWords(blog.blogMetaDescription || 'Click below to continue reading...', 50)}
                        </p>
                    </div>

                    <button className="btn btn-background text-white btn-sm mt-auto w-50">
                        Continue Reading...
                    </button>
                </div>
            </Link>
        </>
    )
}