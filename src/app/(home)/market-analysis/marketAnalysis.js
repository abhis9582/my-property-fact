"use client";
import axios from "axios";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import { useState } from "react";

export default function MarketAnalysis({ localities }) {
  const [localityDetail, setLocalityDetail] = useState(null);
  const [localityName, setLocalityName] = useState("");
  const getLocalityDetails = async (data) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}locality-data/${data.id}`
    );
    setLocalityDetail(res.data);
    setLocalityName(data.localityName);
  };
  return (
    <div>
      <CommonHeaderBanner headerText={"Market Analysis"} />

      <h1 className="mt-5 text-center">Welcome to analysis page.</h1>
      <div className="container d-flex flex-wrap gap-3 my-5">
        {localities.map((item, index) => (
          <div
            key={index}
            onClick={() => getLocalityDetails(item)}
            className="border border-2 rounded-2 py-1 px-2 cursor-pointer"
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
            <div>
              <h2 className="mt-5">O – Ongoing / Future Projects (150 pts)</h2>
              <ul className="mt-3">
                {console.log(localityDetail)}
                {localityDetail.onGoingFutureProjectsList.map((item, index) => (
                  <li className="my-2" key={index}>
                    {item}
                  </li>
                ))}
              </ul>
              <span>
                Score Estimate: {localityDetail.onGoingFutureProjectsScore}/200
              </span>
            </div>
            <div>
              <h2 className="mt-5">C – Connectivity & Commute (150 pts)</h2>
              <ul className="mt-3">
                {localityDetail.connectivityAndCommuteList.map(
                  (item, index) => (
                    <li className="my-2" key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>
              <span>
                Score Estimate: {localityDetail.connectivityAndCommuteScore}/200
              </span>
            </div>
            <div>
              <h2 className="mt-5">A – Amenities & Gentrification (150 pts)</h2>
              <ul className="mt-3">
                {localityDetail.amenitiesAndGentrificationList.map(
                  (item, index) => (
                    <li className="my-2" key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>
              <span>
                Score Estimate: {localityDetail.amenitiesAndGentrificationScore}
                /200
              </span>
            </div>
            <div>
              <h2 className="mt-5">T – Trends & Historical Data (150 pts)</h2>
              <ul className="mt-3">
                {localityDetail.trendsAndHostoricalDataList.map(
                  (item, index) => (
                    <li className="my-2" key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>
              <span>
                Score Estimate: {localityDetail.trendsAndHistoricalDataScore}
                /200
              </span>
            </div>
            <div>
              <h2 className="mt-5">E – Existing Supply vs Demand (200 pts)</h2>
              <ul className="mt-3">
                {localityDetail.exestingSupplyList.map((item, index) => (
                  <li className="my-2" key={index}>
                    {item}
                  </li>
                ))}
              </ul>
              <span>
                Score Estimate: {localityDetail.existingSupplyScore}/200
              </span>
            </div>
            <table className="my-3 table table-bordered table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Score (Max)</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(7)].map((_, index) => (
                  <tr key={index}>
                    <td>Local Economy (L)</td>
                    <td>{localityDetail.localEconomyScore}/200</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
                <h3>Final LOCATE Score: ~865/1000</h3>
                <span className="text-sm">Grade: Excellent (Investment Grade A)</span>
            </div>
            <div>
              <h2 className="mt-5">Interpretation & Outlook</h2>
              <ul className="mt-3">
                {localityDetail.interpretationAndOutlookList.map((item, index) => (
                  <li className="my-2" key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mt-5">Recommendations for Investors</h2>
              <ol className="mt-3">
                {localityDetail.recommendationsForInvestorsList.map((item, index) => (
                  <li className="my-2" key={index}>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
