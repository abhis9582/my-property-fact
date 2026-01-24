import {
  fetchBuilderData,
  fetchCityData,
  fetchProjectTypes,
  fetchAllProjects,
} from "@/app/_global_components/masterFunction";
import HeaderComponent from "./headerComponent";

const Header = async () => {
  const [cities, projectTypes, builders, projects] = await Promise.all([
    fetchCityData(),
    fetchProjectTypes(),
    fetchBuilderData(),
    fetchAllProjects(),
  ]);

  return (
    <HeaderComponent
      cityList={cities}
      projectTypes={projectTypes}
      builderList={builders.builders}
      projectList={projects}
    />
  );
};

export default Header;
