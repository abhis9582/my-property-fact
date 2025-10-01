import { fetchAllStories } from "@/app/_global_components/masterFunction";
import NewsAndViews from "./newsView";
export default async function NewsViews() {
  const stories = await fetchAllStories();
  return (
    <>
      <NewsAndViews webStoryList={stories} />
    </>
  );
}
