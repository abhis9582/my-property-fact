import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ blog }) {
    return (
        <>
            <Link href={`/blog/${blog.slugUrl}`}
                className="card border-0 rounded-4 overflow-hidden custom-shadow"
                style={{ maxWidth: '31rem', transition: 'transform 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                <Image
                    width={400}
                    height={250}
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}blog/${blog.blogImage}`}
                    alt={blog.blogTitle}
                    className="card-img-top"
                    unoptimized={true}
                />
                <div className="card-body">
                    <h4 className="card-title fw-bold">{blog.blogTitle.replace(/\u00A0/g, ' ')}</h4>
                    <p className="card-text text-muted small">
                        {blog.blogMetaDescription || 'Click below to continue reading...'}
                    </p>
                    <button className="btn btn-background text-white btn-sm mt-2">
                        Continue Reading
                    </button>
                </div>
            </Link>
        </>
    )
}