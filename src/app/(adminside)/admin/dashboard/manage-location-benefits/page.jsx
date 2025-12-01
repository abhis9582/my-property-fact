import axios from "axios";
import ManageLocationBenefits from "./manageLocationBenefits";

export const dynamic = 'force-dynamic';

// Fetching all nearby benefits list
const fetchNearbyBenefits = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(`${apiUrl}/nearby-benefit/get-all`);
    const list = response.data.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
    return list;
  } catch (error) {
    console.error("Error fetching nearby benefits:", error);
    return [];
  }
};

export default async function ManageLocationBenefitsPage() {
    const list = await fetchNearbyBenefits();
    return <ManageLocationBenefits allBenefits={list} />;
}