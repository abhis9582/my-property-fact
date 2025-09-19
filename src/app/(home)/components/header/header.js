import {
  fetchBuilderData,
  fetchCityData,
  fetchProjectTypes,
} from "@/app/_global_components/masterFunction";
import HeaderComponent from "./headerComponent";

const Header = async () => {
  const [cities, projectTypes, builders] = await Promise.all([
    fetchCityData(),
    fetchProjectTypes(),
    fetchBuilderData(),
  ]);

  return (
    <HeaderComponent
      cityList={cities}
      projectTypes={projectTypes}
      builderList={builders.builders}
    />
  );
};

export default Header;
