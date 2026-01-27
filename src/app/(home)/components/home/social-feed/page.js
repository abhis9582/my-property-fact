import { fetchBlogs } from "@/app/_global_components/masterFunction";
import SocialFeed from "./socialfeed";
export const dynamic = "force-dynamic";
export default async function SocialFeedPage() {
  // Getting 4 latest blogs
  const list = await fetchBlogs(0, 4);
  // Returning the social feed page
  return <SocialFeed data={list.content} />;
}
