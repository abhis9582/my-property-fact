"use client";
import { faFileExcel, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { exportTOExcel } from "../common-model/exporttoexcel";
import { toast } from "react-toastify";
export default function Enquiries() {
    const [enquiryList, setEnquiryList] = useState([]);

    useEffect(() => {
        const fetchEnquiries = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}enquiry/get-all`);
            const list = response.data;
            const res = list.map((item, index) => ({
                ...item,
                index: index + 1
            }));
            setEnquiryList(res);
        };

        fetchEnquiries();
    }, []);
    //Handle opening confirmation box
    const openConfirmationDialog = (id) => {

    }

    //Handle Edit model
    const openEditPopUp = (item) => {

    }

    //Handle Export file to excel
    const exportToExcel = async () => {
        exportTOExcel(enquiryList, "Enquiries");
        toast.success("Enquiries exported successfully...");
    }

    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 70 },
        { field: "name", headerName: "Name", width: 180 },
        { field: "email", headerName: "Email", width: 250 },
        {
            field: "phone",
            headerName: "Phone",
            width: 150,
        },
        {
            field: "message",
            headerName: "Message",
            width: 400,
        },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => (
                <div>
                    <FontAwesomeIcon
                        className="mx-3 text-danger"
                        style={{ cursor: "pointer" }}
                        icon={faTrash}
                        onClick={() => openConfirmationDialog(params.row.id)}
                    />
                    <FontAwesomeIcon
                        className="text-warning"
                        style={{ cursor: "pointer" }}
                        icon={faPencil}
                        onClick={() => openEditPopUp(params.row)}
                    />
                </div>
            ),
        },
    ];
    const paginationModel = { page: 0, pageSize: 10 };
    return (
        <div>
            <div className="d-flex justify-content-between mt-3">
                <p className="h1">Manage Enquiries</p>
                <div className="d-flex gap-3">
                    <Button className="btn btn-warning fw-bold" onClick={exportToExcel}>
                        <FontAwesomeIcon width={15} className="mx-2" icon={faFileExcel}/>
                        Export to excel
                    </Button>
                    <Button className="btn btn-success">
                        +Add New
                    </Button>
                </div>
            </div>
            <div className="table-container mt-5">
                <Paper sx={{ height: 550, width: "100%" }}>
                    <DataGrid
                        rows={enquiryList}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[10, 15, 20, 50]}
                        checkboxSelection
                        sx={{
                            border: 0,
                            "& .MuiDataGrid-columnHeader": {
                                fontWeight: "bold", // Make headings bold
                                fontSize: "16px", // Optional: Adjust size
                                backgroundColor: "#68ac78", // Optional: Light background
                            },
                        }}
                    />
                </Paper>
            </div>
        </div>
    );
}