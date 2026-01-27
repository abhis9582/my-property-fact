import HeaderComponent from "./headerComponent";
import {
  fetchBuilderData,
  fetchCityData,
  fetchProjectTypes,
  fetchAllProjects,
} from "@/app/_global_components/masterFunction";

const HeaderClient = async () => {
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
      builderList={builders}
      projectList={projects}
    />
  );
};

export default HeaderClient;
