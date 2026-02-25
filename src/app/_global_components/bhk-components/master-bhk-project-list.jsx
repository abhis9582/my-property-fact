"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllProjects } from "../masterFunction";
import PropertyContainer from "@/app/(home)/components/common/page";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import Link from "next/link";

export default function MasterBHKProjectList() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [filteredProjectsByBrType, setFilteredProjectsByBrType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState("");
  const [floorTypeList, setFloorTypeList] = useState([]);
  const getListOfProjectFromBkType = async () => {
    const bkType = searchParams.get("type");
    let cat = "";
    if(pathName.includes("commercial")) {
      cat = "commercial";
    }else if(pathName.includes("flats")) {
      cat = "flats";
    }else if(pathName.includes("new-projects")){
      cat = "new-projects";
    }else {
      cat = "apartments";
    }
    if (projects.length > 0) {
      let filteredData = projects;
      if (bkType) {
        filteredData = projects.filter((item) => {
          const types = item.projectConfiguration
            .split(",")
            .map((type) => type.trim());
          setLoading(false);
          return types?.includes(bkType);
        });
      }
      switch (cat) {
        case "apartments":
          filteredData = projects.filter(
            (item) =>
              item.propertyTypeName.toLowerCase() === "residential" &&
              item.cityName.toLowerCase() === cityName.trim().toLowerCase()
          );
          setFloorTypeList(
            Array.from(
              new Set(
                filteredData
                  .filter(
                    (item) =>
                      item.cityName.toLowerCase() === cityName.toLowerCase()
                  )
                  .flatMap((item) =>
                    item.projectConfiguration
                      .split(",")
                      .map((type) => `${type.trim()}|${item.cityName}`)
                  )
              )
            )
          );
          break;
        case "new-projects":
          filteredData = projects.filter(
            (item) =>
              item.projectStatusName === "New Launched" &&
              item.cityName.toLowerCase() === cityName.toLowerCase()
          );
          setFloorTypeList(
            Array.from(
              new Set(
                filteredData
                  .filter(
                    (item) =>
                      item.cityName.toLowerCase() === cityName.toLowerCase()
                  )
                  .flatMap((item) =>
                    item.projectConfiguration
                      .split(",")
                      .map((type) => `${type.trim()}|${item.cityName}`)
                  )
              )
            )
          );
          break;
        case "flats":
          filteredData = projects.filter(
            (item) =>
              item.cityName.toLowerCase() === cityName.trim().toLowerCase() &&
              item.propertyTypeName.toLowerCase() === "residential"
          );
          setFloorTypeList(
            Array.from(
              new Set(
                filteredData
                  .filter(
                    (item) =>
                      item.cityName.toLowerCase() === cityName.toLowerCase()
                  )
                  .flatMap((item) =>
                    item.projectConfiguration
                      .split(",")
                      .map((type) => `${type.trim()}|${item.cityName}`)
                  )
              )
            )
          );
          break;
        case "commercial":
          filteredData = projects.filter(
            (item) =>
              item.propertyTypeName.toLowerCase() === "commercial" &&
              item.cityName.toLowerCase() === cityName.toLowerCase()
          );
          setFloorTypeList(
            Array.from(
              new Set(
                filteredData
                  .filter(
                    (item) =>
                      item.cityName.toLowerCase() === cityName.toLowerCase()
                  )
                  .flatMap((item) =>
                    item.projectConfiguration
                      .split(",")
                      .map((type) => `${type.trim()}|${item.cityName}`)
                  )
              )
            )
          );
          break;
        default:
          filteredData = projects.filter(
            (item) =>
              item.cityName.toLowerCase() === cityName.trim().toLowerCase()
          );
          setFloorTypeList(
            Array.from(
              new Set(
                filteredData
                  .filter(
                    (item) =>
                      item.cityName.toLowerCase() === cityName.toLowerCase()
                  )
                  .flatMap((item) =>
                    item.projectConfiguration
                      .split(",")
                      .map((type) => `${type.trim()}|${item.cityName}`)
                  )
              )
            )
          );
          break;
      }
      setLoading(false);
      return filteredData;
    }
    return [];
  };

  useEffect(() => {
    const slugPrefix = [
      "/flats-in-",
      "/apartments-in-",
      "/commercial-property-in-",
      "/new-projects-in-",
    ];
    async function fetchData() {
      const data = await fetchAllProjects();
      setProjects(data);
      let foundCity = "";
      slugPrefix.map((slug) => {
        if (pathName.includes(slug)) {
          foundCity = pathName.replace(slug, "").replace(/-/g, " ");
        }
      });
      setCityName(foundCity);
    }
    fetchData();
  }, [pathName]);

  useEffect(() => {
    if (!projects.length || !cityName) return;
    setLoading(true);
    async function updateFilteredProjects() {
      const filteredData = await getListOfProjectFromBkType();
      setFilteredProjectsByBrType(filteredData);
    }
    updateFilteredProjects();
  }, [projects, cityName]);

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
      {floorTypeList.length > 0 && (
        <div
          className="bg-light py-5 mt-5 text-center font-gotham-medium fs-4 text-uppercase text-dark d-flex justify-content-center align-items-center
        gap-3 flex-wrap"
        >
          {floorTypeList.map((unique) => {
            const [type, city] = unique.split("|");
            return (
              <Link
                key={unique}
                className="text-dark text-decoration-none bg-secondary rounded-3 px-3 py-2 fs-6 border border-secondary bg-white"
                href={`${type
                  .toLowerCase()
                  .split(" ")
                  .join("-")}-in-${city.trim().replace(' ', '-').toLowerCase()}`}
              >
                {type} in {city}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
