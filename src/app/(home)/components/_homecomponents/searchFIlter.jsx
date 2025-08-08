"use client";

import { useProjectContext } from "@/app/_global_components/contexts/projectsContext";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

export default function SearchFilter({ projectTypeList, cityList }) {
  const [propertType, setPropertyType] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [budget, setBudget] = useState("");
  const { setProjectData } = useProjectContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //defining project range
  const projectRange = ["Up to 1Cr*", "1-3 Cr*", "3-5 Cr*", "Above 5 Cr*"];
  const handleSubmit = async (e) => {
    e.preventDefault();
    let params_obj = {
      propertyType: propertType,
      propertyLocation: propertyLocation,
      budget: budget,
    };

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/search-by-type-city-budget`,
        {
          params: {
            propertyType: propertType,
            propertyLocation: propertyLocation,
            budget: budget,
          },
        }
      );
      sessionStorage.setItem("mpf-querry", JSON.stringify(params_obj));
      setProjectData(response.data);
      router.push(`/projects`);
    } catch (error) {
      console.error("Error during project filtering:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (sessionStorage.getItem("mpf-querry")) {
      sessionStorage.removeItem("mpf-querry");
    }
  }, []);
  return (
    <div className="position-absolute bottom-25 start-50 translate-middle w-100 home-search-container">
      <div className="container bg-light border rounded-4 custom-shadow">
        <form method="Get" action="projects">
          <div className="d-flex flex-wrap flex-md-row flex-column p-4 gap-3 font-gotham-light">
            <div className="col">
              <select
                name="category"
                id="category"
                className="form-select"
                title="category"
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Property Type</option>
                {projectTypeList.map((item, index) => (
                  <option
                    key={`${item.projectTypeName}-${index}`}
                    value={item.id}
                  >
                    {item.projectTypeName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <select
                name="location"
                id="location"
                className="form-select"
                title="location"
                onChange={(e) => setPropertyLocation(e.target.value)}
              >
                <option value="">Select Location</option>
                {cityList.map((item, index) => (
                  <option key={`${item.name}-${index}`} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <select
                name="projectname"
                id="projectname"
                className="form-select"
                title="projectname "
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="">Price Range</option>
                {projectRange.map((option, index) => (
                  <option key={`${option.id}-${index}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex align-items-center">
              <button
                type="submit"
                className="py-1 px-4 text-light m-0 border rounded-3 btn-background"
                onClick={handleSubmit}
                aria-label="Search"
              >
                {loading ? (
                  <Spinner animation="border" variant="light" />
                ) : (
                  <FontAwesomeIcon icon={faSearch} size="lg" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
