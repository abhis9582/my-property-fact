import axios from "axios";
import LocateScore from "./locateScore";

// fetch all localities
const fetchAllLocalities = async () => {
  const localities = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}locality/get-all`
  );
  const res = localities.data.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
  return res;
};

export default async function LocateScorePage() {
  const localities = await fetchAllLocalities();
  return (
    <div>
      <LocateScore localities={localities} />
    </div>
  );
}
