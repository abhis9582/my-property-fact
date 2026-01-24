import Featured from "./featured";

export default async function FeaturedPage({
  url,
  autoPlay,
  allFeaturedProperties = [],
  type,
  title,
}) {
  if (type === "Similar") {
    return (
      <Featured
        url={url}
        allProjects={allFeaturedProperties}
        autoPlay={autoPlay}
        type={type}
        badgeVariant={type === "Similar" ? "default" : "home-featured"}
        title={title}
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
          title={title}
        />
      </>
    );
  }
}
