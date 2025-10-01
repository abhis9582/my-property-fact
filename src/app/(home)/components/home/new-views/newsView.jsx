"use client";
import Image from "next/image";
import Link from "next/link";
import "../new-views/newviews.css";

export default function NewsAndViews({ webStoryList }) {
  return (
    <div className="container">
      <div className="row">
        {webStoryList
          .filter((item) => item.webStories.length > 0)
          .map((item, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link
                className="h-100 text-decoration-none text-dark shadow-sm"
                href={`${process.env.NEXT_PUBLIC_API_URL}web-story/${item.categoryName}`}
              >
                <div className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}web-story/${item.storyCategoryImage}`}
                        alt={item.categoryName}
                        width={384}
                        height={683}
                        className="card-img-top img-fluid"
                      />
                      <div className="title-3d">
                        <p className="text-center m-0 p-2">{item.categoryName}</p>
                      </div>
                    </div>
                    <div className="flip-card-back">
                      <p>{item.categoryDescription}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
          .slice(0, 4)}
      </div>
    </div>
  );
}
