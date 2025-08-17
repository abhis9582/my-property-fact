import Featured from "./featured";

export default async function FeaturedPage({ url, autoPlay, projectsList= [] }) {  
  return (
    <>
      <Featured
        allFeaturedProperties={projectsList}
        url={url}
        allProjects={projectsList}
        autoPlay={autoPlay}
      />
    </>
  );
}
