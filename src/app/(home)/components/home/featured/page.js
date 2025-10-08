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
      />
    );
  } else {
    return (
      <>
        <Featured
          url={url}
          allProjects={allFeaturedProperties}
          autoPlay={autoPlay}
        />
      </>
    );
  }
}
