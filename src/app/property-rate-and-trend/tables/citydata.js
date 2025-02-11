"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./citydata.css";
import ExternalData from "./data.json";
import { useEffect, useState } from "react";
export default function CityData() {
  const [externalData, setExternalData] = useState([]);
  const [aggregationFromList, setAggregationFromList] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [listData, setListData] = useState([]);
  useEffect(() => {
    setExternalData(ExternalData.props.pageProps.formattedData);
    fetchAggregationFromList();
    fetchHeaders();
  }, []);
  const fetchAggregationFromList = () => {
    ExternalData.props.pageProps.formattedData.map((item) => {
      setAggregationFromList(item.aggregationFromList);
    });
  };
  const fetchHeaders = () => {
    ExternalData.props.pageProps.formattedData.map((item) => {
      setHeaders(item.headers);
    });
  };
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  const changeTableData = (value, index) => {
    const filteredItem = aggregationFromList.find(
      (item) => item.aggregationFromDisplayName === value
    );
    setActiveIndex(index);
    setListData(filteredItem.details);
  };
  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24),
    createData("Ice cream sandwich", 237, 9.0, 37),
    createData("Eclair", 262, 16.0, 24),
    createData("Cupcake", 305, 3.7, 67),
    createData("Gingerbread", 356, 16.0, 49),
  ];
  return (
    <>
      <div className="insight-property-rate-filter">
        <div className="insight-property-rate-filter-child">
          {externalData.map((item, index) => (
            <p
              key={`${item.categoryDisplayName}-${index}`}
              className={`${
                activeCat === index
                  ? "insight-property-rate-filter-child-active"
                  : ""
              } cursor-pointer`}
              // onClick={() => changeTableData(item.aggregationFromDisplayName, index)}
            >
              {item.categoryDisplayName}
            </p>
          ))}
        </div>
        <div className="insight-property-rate-filter-child">
          {aggregationFromList.map((item, index) => (
            <p
              key={`${item.aggregationFromDisplayName}-${index}`}
              className={`${
                activeIndex === index
                  ? "insight-property-rate-filter-child-active"
                  : ""
              } cursor-pointer`}
              onClick={() => changeTableData(item.aggregationFromDisplayName, index)}
            >
              {item.aggregationFromDisplayName}
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
              {headers.map((item, index) => (
                <TableCell
                  key={`${item.headerDisplayName}-${index}`}
                  className="fw-bold"
                >
                  {item.headerDisplayName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {listData.map((row) => (
              <TableRow
                key={row.city}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.city}
                </TableCell>
                <TableCell>{row.noOfTransactions}</TableCell>
                <TableCell>{row.currentRate}</TableCell>
                <TableCell>{row.changeValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
