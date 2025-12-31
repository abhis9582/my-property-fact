"use client";
import PropertyContainer from "@/app/(home)/components/common/page";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { useEffect, useState } from "react";
import { getAllProjects } from "../masterFunction";

export default function ProjectListByFloorTypeClient({ title }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjectsByBrType, setFilteredProjectsByBrType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState("");
  const getListOfProjectFromBkType = async (projects, bhkType, city) => {
    if (projects.length > 0) {
      let filteredData = [];
      if (bhkType) {
        filteredData = projects
          .filter((item) => item.cityName.toLowerCase() === city.toLowerCase())
          .filter((item) => {
            const types = item.projectConfiguration
              .split(",")
              .map((type) => type.toUpperCase().trim());
            setLoading(false);
            return types?.includes(bhkType.toUpperCase());
          });
      }
      setLoading(false);
      return filteredData;
    }
    return [];
  };

  useEffect(() => {
    const bhkType = title.split(" In ")[0];
    const city = title.split(" In ")[1];
    console.log("cityname", city);
    async function fetchData() {
      const data = await getAllProjects();
      const filteredData = await getListOfProjectFromBkType(
        data,
        bhkType,
        city.replace('%20', ' ')
      );
      setFilteredProjectsByBrType(filteredData);
      setProjects(data);
    }
    fetchData();
  }, []);
  return (
    <>
      <div className="container my-5">
        <div className="row g-3">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center w-100">
              <LoadingSpinner show={loading} />
            </div>
          ) : filteredProjectsByBrType.length > 0 ? (
            filteredProjectsByBrType.map((project, index) => (
              <div key={index} className="col-12 col-sm-6 col-md-4">
                <PropertyContainer data={project} />
              </div>
            ))
          ) : (
            !loading && (
              <p>
                No projects found for the selected {cityName.toUpperCase()}{" "}
                type.
              </p>
            )
          )}
        </div>
      </div>
    </>
  );
}
