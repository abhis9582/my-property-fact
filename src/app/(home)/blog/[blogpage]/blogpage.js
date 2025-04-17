"use client";
import axios from "axios";
import CommonBreadCrum from "../../components/common/breadcrum";
import CommonHeaderBanner from "../../components/common/commonheaderbanner";
import { useEffect, useState } from "react";
import Image from "next/image";
import "./../media.css";
export default function BlogDetail({ slug }) {
    const [blogDetail, setBlogDetail] = useState({});
    //fetch blog detail using slug
    const fetchBlogDetail = async (url) => {
        // fetching blog detail from api using slug
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}blog/get/${url}`);
        setBlogDetail(response.data);
    }

    useEffect(() => {
        fetchBlogDetail(slug);
    }, [slug]);
    return (
        <div>
            <CommonHeaderBanner image={"builder-banner.jp"} headerText={"Blog-Detail"} />
            <CommonBreadCrum pageName={slug} firstPage={"Blog"} />
            <div className="container py-5">
                <div className="row g-5">
                    {/* Blog Content */}
                    <div className="col-lg-8">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}blog/${blogDetail.blogImage}`}
                            alt={blogDetail.blogTitle || ""}
                            className="img-fluid rounded shadow-sm mb-4"
                            width={1200}
                            height={648}
                        />

                        <h1 className="fw-bold mb-3">{blogDetail.blogTitle}</h1>

                        <div className="text-muted fs-5 lh-lg"
                            dangerouslySetInnerHTML={{
                                __html: blogDetail.blogDescription,
                            }}>
                        </div>
                        <div className="d-flex flex-wrap gap-2 mt-4">
                            {(blogDetail.blogKeywords || '')
                                .split(',')
                                .map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="keyword-tag"
                                    >
                                        {keyword.trim()}
                                    </span>
                                ))}
                        </div>

                    </div>

                    {/* Contact Form */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm rounded-4 p-4 blog-contact-form">
                            <h4 className="fw-semibold mb-4">Get in Touch</h4>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Your Name</label>
                                    <input type="text" className="form-control" id="name" placeholder="John Doe" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input type="email" className="form-control" id="email" placeholder="john@example.com" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea className="form-control" id="message" rows="4" placeholder="Write your message here..."></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}