import axios from "axios";
import WebStory from "./webStory";
export const dynamic = 'force-dynamic';
//fetching category list form api
const fetchCategoryList = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}web-story-category/get-all`);
    return response.data;
}

//fetching category list form api
const fetchStoryList = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}web-story/get-all`);
    const res = response.data.map((item, index)=> ({
        ...item,
        index: index + 1
    }));    
    return res;
}

export default async function WebStroyPage() {
    const categoryList = await fetchCategoryList();
    const list = await fetchStoryList();
    
    return (
        <>
            <WebStory categoryList={categoryList} list={list}/>
        </>
    )
}