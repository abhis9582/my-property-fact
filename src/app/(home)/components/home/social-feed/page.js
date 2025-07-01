import axios from "axios";
import SocialFeed from "./socialfeed";
export const dynamic = 'force-dynamic';
// fetching blogs list from api
const getBlogsList = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}blog/get?page=${0}&size=${3}`);
  return response.data.content;
}

export default async function SocialFeedPage() {
  const list = await getBlogsList();
  return (
    <SocialFeed data={list}/>
  )
}
