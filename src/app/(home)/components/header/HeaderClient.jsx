import HeaderComponent from "./headerComponent";
import {
  fetchBuilderData,
  fetchCityData,
  fetchProjectTypes,
} from "@/app/_global_components/masterFunction";

const HeaderClient = async () => {
  const [cities, projectTypes, builders] = await Promise.all([
    fetchCityData(),
    fetchProjectTypes(),
    fetchBuilderData(),
  ]);

  return (
    <HeaderComponent
      cityList={cities}
      projectTypes={projectTypes}
      builderList={builders}
    />
  );
};

export default HeaderClient;
