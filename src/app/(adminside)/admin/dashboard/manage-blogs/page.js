import axios from "axios";
import ManageBlogs from "./manageBlogs";

//Fetching all blogs list from api
const fetchBlogList = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}blog/get-all`);
    const res = response.data.map((item, index) => ({
        ...item,
        index: index + 1
    }));
    return res;
}
//Fetching all blogs categories
const fetchBlogCategory = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}blog-category/get-all`);
    return response.data;
}
export default async function ManageBlogPage() {
    const [list, categoryList] = await Promise.all([
        fetchBlogList(),
        fetchBlogCategory()
    ]);
    return <ManageBlogs list={list} categoryList={categoryList} />
}