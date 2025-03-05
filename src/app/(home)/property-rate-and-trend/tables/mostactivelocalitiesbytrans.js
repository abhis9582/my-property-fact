"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./citydata.css";
import { useEffect, useState } from "react";
import axios from "axios";
export default function MostActiveLocalitiesByTransaction() {
  const [defaultAggregationFrom, setDefaultAggregationFrom] = useState("1Yr");
  const [defaultCategory, setDefaultCategory] = useState("All");
  const [cityPriceList, setCityPriceList] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [aggregationFromList, setAggregationFromList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [activeCat, setActiveCat] = useState(0);
  const [activeIndex, setActiveIndex] = useState(2);
  const [response, setResponse] = useState([]);
  // fetching all data for city price list
  const fetchCityPriceData = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}top-locations-by-transaction/top-location-by-transaction`
    );
    if (response) {
      fetchAllCategories(response.data);
      fetchAggregationFromList(response.data);
      fetchTableHeaders(response.data);
      fetchCityPriceList(response.data);
      setResponse(response.data);
    }
  };

  // fetching all categories
  const fetchAllCategories = async (data) => {
    const categories = data.map((item) => item.categoryDisplayName);
    setCategoryList(categories);
  };

  // fetch aggregation from list
  const fetchAggregationFromList = async (data) => {
    const aggregationList = data.map((item) => item.aggregationFromList);
    const list = aggregationList[0].map(
      (item) => item.aggregationFromDisplayName
    );
    setAggregationFromList(list);
  };

  // fetch all table headers
  const fetchTableHeaders = async (data) => {
    const headers = data.map((item) => item.headers);
    const headersList = headers[0].map((item) => item.headerDisplayName);
    setTableHeaders(headersList.slice(0, -1));
  };

  // fetch all city price list
  const fetchCityPriceList = async (data) => {
    const allCategoryData = await data.filter(
      (item) => item.categoryDisplayName === defaultCategory
    );
    const allCityPriceForOneYr = allCategoryData[0].aggregationFromList.filter(
      (item) => item.aggregationFromDisplayName === defaultAggregationFrom
    );
    setCityPriceList(allCityPriceForOneYr[0].locationDetails);
  };
  // handling changing data of the table
  const changeTableData = async (value, index) => {
    setDefaultAggregationFrom(value);
    const allCategoryData = response.filter(
      (item) => item.categoryDisplayName === defaultCategory
    );
    const allCityPriceForOneYr = allCategoryData[0].aggregationFromList.filter(
      (item) => item.aggregationFromDisplayName === value
    );
    setCityPriceList(allCityPriceForOneYr[0].locationDetails);
    setActiveIndex(index);
  };
  // handling changing data of the table according to category
  const getCategoryWiseData = async (value, index) => {
    setDefaultCategory(value);    
    const allCategoryData = response.filter(
      (item) => item.categoryDisplayName === value
    );
    const allCityPriceForOneYr = allCategoryData[0].aggregationFromList.filter(
      (item) => item.aggregationFromDisplayName === defaultAggregationFrom
    );
    setCityPriceList(allCityPriceForOneYr[0].locationDetails);
    setActiveCat(index);
  };
  useEffect(() => {
    fetchCityPriceData();
  }, []);

  return (
    <>
      <div className="insight-property-rate-filter">
        <div className="insight-property-rate-filter-child">
          {categoryList.map((item, index) => (
            <p
              key={`${item}-${index}`}
              className={`${
                activeCat === index
                  ? "insight-property-rate-filter-child-active"
                  : ""
              } cursor-pointer`}
              onClick={() => getCategoryWiseData(item, index)}
            >
              {item}
            </p>
          ))}
        </div>
        <div className="insight-property-rate-filter-child">
          {aggregationFromList.map((item, index) => (
            <p
              key={`${item}-${index}`}
              className={`${
                activeIndex === index
                  ? "insight-property-rate-filter-child-active"
                  : ""
              } cursor-pointer`}
              onClick={() => changeTableData(item, index)}
            >
              {item}
            </p>
          ))}
        </div>
      </div>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflowY: "auto" }}
      >
        <Table sx={{ minWidth: 550 }} stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              {tableHeaders.map((item, index) => (
                <TableCell key={`${item}-${index}`} className="fw-bold">
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {cityPriceList.map((row, index) => (
              <TableRow
                key={`${row.city}-${index}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.location}
                  <br />
                  {row.city}
                </TableCell>
                <TableCell>{row.transactions}</TableCell>
                <TableCell>{row.currentPrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
