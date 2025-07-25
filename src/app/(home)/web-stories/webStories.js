"use client";

import Image from "next/image";
import Link from "next/link";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import CommonBreadCrum from "../components/common/breadcrum";

export default function WebStories({ webStoryList }) {
    return (
        <>
            <CommonHeaderBanner
                image={"project-banner.jpg"}
                headerText={"Web Stories"}
            />
            <CommonBreadCrum
                pageName={"web-stories"}
            />
            <div className="container py-4">
                <div className="row">
                    {webStoryList
                        .filter((item) => item.webStories.length > 0)
                        .map((item, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <Link
                                    className="card h-100 text-decoration-none text-dark shadow-sm"
                                    href={`${process.env.NEXT_PUBLIC_API_URL}web-story/${item.categoryName}`}
                                >
                                    <div className="">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}web-story/${item.storyCategoryImage}`}
                                            alt={item.categoryName}
                                            width={150}
                                            height={450}
                                            className="card-img-top"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title text-capitalize">{item.categoryName}</h5>
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