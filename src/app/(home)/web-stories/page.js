import axios from "axios";
import WebStories from "./webStories";
export const dynamic = 'force-dynamic';

//fetch all web stories topics
const fetchAllStoryTopics = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}web-story-category/get-all`);
    return response.data;
}

export default async function WebStoriesPage(){
    const webStoryList = await fetchAllStoryTopics();
    return(
        <>
            <WebStories webStoryList={webStoryList}/>
        </>
    )
}