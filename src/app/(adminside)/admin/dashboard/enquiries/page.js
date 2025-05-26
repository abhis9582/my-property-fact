import axios from "axios";
import Enquiries from "./enquires";

//Fetching all enquries from api
const fetchEnquiries = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}enquiry/get-all`);
    const list = response.data.map((item, index) => ({
        ...item,
        date: new Date(item.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    })).reverse();
    
    const res = list.map((item, index) => ({
        ...item,
        index: index + 1
    }));
    return res;
};

export default async function EnquiriesPage() {
    const list = await fetchEnquiries();
    return <Enquiries list={list} />
}