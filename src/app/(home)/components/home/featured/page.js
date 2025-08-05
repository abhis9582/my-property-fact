import Featured from "./featured";
export default async function FeaturedPage({ type, url, autoPlay, allFeaturedProperties }) {
  const projectsList = allFeaturedProperties;
  console.log(projectsList.length);
  
  let newList = [];
  if (type === 1 || type === 2) {
    const filterData = Array.isArray(projectsList)
      ? projectsList.filter((p) => p.propertyType === type)
      : [];
    newList = filterData;
  } else {
    newList = projectsList;
  }
  return (
    <>
      <Featured allFeaturedProperties={newList} url={url} allProjects = {projectsList} autoPlay={autoPlay}/>
    </>
  );
}
