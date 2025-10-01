import { fetchAllBenefits } from "@/app/_global_components/masterFunction";
import ManageLocationBenefits from "./manageLocationBenefits";

export default async function ManageLocationBenefitsPage() {
    const allBenefits = await fetchAllBenefits();
    const data = allBenefits.map((item, index)=> ({
        ...item,
        index: index + 1
    }));
    return (
        <>
            <ManageLocationBenefits allBenefits={data}/>
        </>
    )
}