import { fetchBlogs } from "@/app/_global_components/masterFunction";
import SocialFeed from "./socialfeed";
export const dynamic = "force-dynamic";
export default async function SocialFeedPage() {
  const list = await fetchBlogs(0, 3);
  console.log(list.content.length);
  
  return <SocialFeed data={list.content} />;
}
