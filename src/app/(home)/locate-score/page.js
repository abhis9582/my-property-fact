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

const locateCategories = [
  {
    key: "localEconomy",
    label: "L – Local Economy & Indicators",
    maxScore: 200,
    listKey: "localEconomyList",
    scoreKey: "localEconomyScore",
  },
  {
    key: "onGoingFutureProjects",
    label: "O – Ongoing / Future Projects",
    maxScore: 150,
    listKey: "onGoingFutureProjectsList",
    scoreKey: "onGoingFutureProjectsScore",
  },
  {
    key: "connectivityAndCommute",
    label: "C – Connectivity & Commute",
    maxScore: 150,
    listKey: "connectivityAndCommuteList",
    scoreKey: "connectivityAndCommuteScore",
  },
  {
    key: "amenitiesAndGentrification",
    label: "A – Amenities & Gentrification",
    maxScore: 150,
    listKey: "amenitiesAndGentrificationList",
    scoreKey: "amenitiesAndGentrificationScore",
  },
  {
    key: "trendsAndHistoricalData",
    label: "T – Trends & Historical Data",
    maxScore: 150,
    listKey: "trendsAndHostoricalDataList", // typo in your API key?
    scoreKey: "trendsAndHistoricalDataScore",
  },
  {
    key: "existingSupply",
    label: "E – Existing Supply vs Demand",
    maxScore: 200,
    listKey: "exestingSupplyList", // typo? should be `existingSupplyList`?
    scoreKey: "existingSupplyScore",
  },
];


export default async function LocateScorePage() {
  const localities = await fetchAllLocalities();
  return (
    <div>
      <LocateScore localities={localities} locateCategories={locateCategories}/>
    </div>
  );
}
