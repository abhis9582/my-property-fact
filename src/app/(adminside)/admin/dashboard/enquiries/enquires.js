"use client";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { exportTOExcel } from "../common-model/exporttoexcel";
import { toast } from "react-toastify";
import DataTable from "../common-model/data-table";
import DashboardHeader from "../common-model/dashboardHeader";
import { useState } from "react";
import CommonModal from "../common-model/common-model";
export default function Enquiries({ list }) {
    const [confirmBox, setConfirmBox] = useState(false);
    const [id, setId] = useState(0);
    //Handle opening confirmation box
    const openConfirmationDialog = (id) => {
        setConfirmBox(true);
        setId(id);
    }

    //Handle Export file to excel
    const exportToExcel = async () => {
        exportTOExcel(list, "Enquiries");
        toast.success("Enquiries exported successfully...");
    }

    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 70, cellClassName: "centered-cell" },
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
            width: 370,
        },
        {
            field: "date",
            headerName: "Data & Time",
            width: 200,
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
                </div>
            ),
        },
    ];
    return (
        <>
            <DashboardHeader buttonName={'Export to excel'} functionName={exportToExcel} heading={'Manage Enquiries'} />
            <div className="mt-5">
                <DataTable columns={columns} list={list} />
            </div>
            <CommonModal
                api={`${process.env.NEXT_PUBLIC_API_URL}enquiry/delete/${id}`}
                setConfirmBox={setConfirmBox}
                confirmBox={confirmBox}
            />
        </>
    );
}