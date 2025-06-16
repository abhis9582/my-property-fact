"use client";

import Image from "next/image";
import Link from "next/link";

export default function WebStories({ webStoryList }) {
    return (
        <>
            <h2 className="mt-5 text-center">Web Stories</h2>
            <div className="container py-4">
                <div className="d-flex flex-row flex-nowrap overflow-auto gap-3">
                    {webStoryList
                        .filter((item) => item.webStories.length > 0)
                        .map((item, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <Link
                                    className="card h-100 text-decoration-none text-dark shadow-sm"
                                    href={`${process.env.NEXT_PUBLIC_API_URL}web-story/${item.categoryName}`}
                                >
                                    <div className="ratio ratio-1x1">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}web-story/${item.storyCategoryImage}`}
                                            alt={item.categoryName}
                                            width={300}
                                            height={300}
                                            className="card-img-top object-fit-cover"
                                        />
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">{item.categoryName}</h5>
                                        <p className="card-text">{item.categoryDescription}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}