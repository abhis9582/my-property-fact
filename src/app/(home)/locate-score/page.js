import CommonHeaderBanner from "../components/common/commonheaderbanner";
import locateScoreData from "./LocateScore.json";
import NewLocateScore from "./NewLocateScore";

// Extract cities from JSON data
const getCitiesFromJSON = () => {
  return locateScoreData.map((item, index) => ({
    id: item.id,
    cityId: item.cityId,
    cityName: item.cityName,
    altName: item.altName,
    state: item.state,
    index: index + 1,
  }));
};

export default function LocateScorePage() {
  const cities = getCitiesFromJSON();
  return (
    <div>
      <CommonHeaderBanner headerText={"LOCATE Score"} />
      {/* <LocateScore cities={cities} locateScoreData={locateScoreData} /> */}
      <NewLocateScore />
    </div>
  );
}
