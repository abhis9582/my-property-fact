import "./media.css";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import CommonBreadCrum from "../components/common/breadcrum";
export default function Media() {
  const blogsList = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <>
      <CommonHeaderBanner image={"blog-banner.jpg"} headerText={""} />
      <CommonBreadCrum pageName={"Blogs"} />
      <div className="container-fluid mt-3">
        <p className="text-center h2 mt-3">Blogs</p>
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {blogsList.map((blog) => (
            <div key={blog} className="card">
              <img
                className="w-100"
                src="https://ecis.in/apis/star-estate-API/star_estate/blogs/2024-11-27_10-37-27_setdesignerworkindoors.webp"
                alt="blog"
              />
              <div className="p-2 mb-3">
                <p className="h5 text-bold">
                  Checkout the Best Residential Projects in Lucknow
                </p>
                <small>Continue Reading...</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
