"use client";
import axios from "axios";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import { useState } from "react";
import styles from './page.module.css';

export default function LocateScore({ localities, locateCategories }) {
  const [localityDetail, setLocalityDetail] = useState(null);
  const [localityName, setLocalityName] = useState("");
  const [noResultFound, setNoResultFound] = useState(null);

  const getLocalityDetails = async (data) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}locality-data/${data.id}`
      );
      if (res.status === 200) {
        setNoResultFound(null);
        setLocalityDetail(res.data);
        setLocalityName(data.localityName);
      }
    } catch (error) {
      setLocalityDetail(null);
      setNoResultFound(error.response.data);
    }
  };
  return (
    <div>
      <CommonHeaderBanner headerText={"LOCATE Score"} />
      <h1 className="mt-5 text-center">Welcome to LOCATE Score page.</h1>
      <div className="container d-flex flex-wrap gap-3 my-5">
        {localities.map((item, index) => (
          <div
            key={index}
            onClick={() => getLocalityDetails(item)}
            className={`${styles.localityButton}`}
          >
            {item.localityName}
          </div>
        ))}
      </div>
      {localityDetail && (
        <div className="container my-5">
          <h1 className="m-0">LOCATE score evaluation for {localityName}</h1>
          <span className="m-0 text-sm">
            focusing on <b>commercial real estate investment.</b>
          </span>
          <div>
            {locateCategories.map((category) => (
              <div key={category.key}>
                <h2 className="mt-5">
                  {category.label} ({category.maxScore} pts)
                </h2>
                <ul className="mt-3">
                  {localityDetail[category.listKey]?.map((item, index) => (
                    <li className="my-2" key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="d-flex">
                  <h4>
                    Score Estimate: {localityDetail[category.scoreKey]}/
                    {category.maxScore}
                  </h4>
                </span>
              </div>
            ))}
            {locateCategories.map((category) => (
              <div key={category.key}>
                <h2 className="mt-5">
                  {category.label} ({category.maxScore} pts)
                </h2>
                <ul className="mt-3">
                  {localityDetail[category.listKey]?.map((item, index) => (
                    <li className="my-2" key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="d-flex">
                  <h4>
                    Score Estimate: {localityDetail[category.scoreKey]}/
                    {category.maxScore}
                  </h4>
                </span>
              </div>
            ))}

            <div>
              <h3>
                Final LOCATE Score: ~
                {locateCategories.reduce(
                  (sum, category) =>
                    sum + (localityDetail[category.scoreKey] || 0),
                  0
                )}
                /1000
              </h3>
              <span className="text-sm">
                Grade: Excellent (Investment Grade A)
              </span>
            </div>
            <div>
              <h2 className="mt-5">Interpretation & Outlook</h2>
              <ul className="mt-3">
                {localityDetail.interpretationAndOutlookList.map(
                  (item, index) => (
                    <li className="my-2" key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h2 className="mt-5">Recommendations for Investors</h2>
              <ol className="mt-3">
                {localityDetail.recommendationsForInvestorsList.map(
                  (item, index) => (
                    <li className="my-2" key={index}>
                      {item}
                    </li>
                  )
                )}
              </ol>
            </div>
          </div>
        </div>
      )}
      {noResultFound && (
        <h1 className="mt-5 text-center text-danger">{noResultFound}</h1>
      )}
    </div>
  );
}
