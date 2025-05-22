"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import BlogCard from "../../common/blogcard";

export default function SocialFeed({ data }) {
    return (
        <div className="container pb-4">
            {data.length < 0 ? <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "250px" }}>
                <LoadingSpinner show={true} />
            </div> :
                <div className="container">
                    <div className="row">
                        {data.map((blog, index) => (
                            <div key={index} className="col-md-4 col-lg-4 col-sm-12 my-3 d-flex justify-content-between">
                                <BlogCard blog={blog} />
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}