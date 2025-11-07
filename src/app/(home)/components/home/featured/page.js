import Featured from "./featured";

export default async function FeaturedPage({
  url,
  autoPlay,
  allFeaturedProperties = [],
  type,
}) {
  if (type === "Similar") {
    return (
      <Featured
        url={url}
        allProjects={allFeaturedProperties}
        autoPlay={autoPlay}
        type={type}
        badgeVariant={type === "Similar" ? "default" : "home-featured"}
      />
    );
  } else {
    return (
      <>
        <Featured
          url={url}
          allProjects={allFeaturedProperties}
          autoPlay={autoPlay}
          badgeVariant="home-featured"
        />
      </>
    );
  }
}
