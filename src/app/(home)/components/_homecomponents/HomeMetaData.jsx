import {
  getAllProjects,
  fetchBuilderData,
  fetchCityData,
  fetchProjectTypes,
} from "@/app/_global_components/masterFunction";
import Link from "next/link";
import AnimatedCounter from "./AnimatedCounter";
import "./HomeMetaData.css";

export default async function HomeMetaData() {
  const totalProjects = await getAllProjects();
  const cities = await fetchCityData();
  const builders = await fetchBuilderData();

  const [projectTypeList] = await Promise.all([fetchProjectTypes()]);
  //Our facts
  const ourFacts = [
    {
      id: 1,
      numbers: `${cities.length}+`,
      text: "Cities",
    },
    {
      id: 2,
      numbers: `${builders.builders.length}+`,
      text: "Builders",
    },
    {
      id: 3,
      numbers: `${totalProjects.length}+`,
      text: "Projects",
    },
    {
      id: 4,
      numbers: "10,030+",
      text: "Units",
    },
  ];
  return (
    <div className="new-home-meta-data-container mt-3">
      <div className="new-home-meta-data-child">
        <h1 className="text-center text-light">Find the best property</h1>
        <div className="d-flex flex-wrap align-item-center justify-content-center gap-4 my-4">
          {projectTypeList.map((item, index) => (
            <div key={`row-${index}`}>
              <Link
                href={`projects/${item.slugUrl}`}
                className="link-btn rounded-5 py-2 px-3 text-white text-decoration-none"
              >
                {item.projectTypeName}
              </Link>
            </div>
          ))}
        </div>
        <div className="data-container">
          {ourFacts.map((item, index) => (
            <div key={`${item.text}-${index}`} className="data-container-child">
              <section>
                <h3 className="m-0">
                  <span>
                    <AnimatedCounter targetValue={item.numbers} suffix="+" />
                  </span>
                </h3>
                <p className="text-center ">{item.text}</p>
              </section>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
