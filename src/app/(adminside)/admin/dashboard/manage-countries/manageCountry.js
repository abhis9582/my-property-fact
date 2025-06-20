"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashboardHeader from "../common-model/dashboardHeader";
import DataTable from "../common-model/data-table";
import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import GenerateForm from "../common-model/generateForm";
import CommonModal from "../common-model/common-model";
import { useRouter } from "next/navigation";

export default function ManageCountry({ list }) {
    const inputFields = [
        {
            id: "countryName",
            label: "Country Name",
            type: "text"
        },
        {
            id: "continent",
            label: "Continent",
            type: "text"
        },
        {
            id: "description",
            label: "Description",
            type: "textarea"
        },
    ];
    const getInitialFormData = () =>
        Object.fromEntries(inputFields.map(item => [item.id, ""]));
    const [showModal, setShowModal] = useState(false);
    const [buttonName, setButtonName] = useState("");
    const [validated, setValidated] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [formData, setFormData] = useState(getInitialFormData);
    const [countryId, setCountryId] = useState(0);
    const [confirmBox, setConfirmBox] = useState(false);
    const router = useRouter();

    //Handeling opening of edit model
    const openEditPopUp = (data) => {
        setTitle("Edit Country");
        setButtonName("Update Country");
        setShowModal(true);
        setFormData({
            id: data.id || 0,
            ...data
        });
    };

    //Handeling opening of add model
    const openAddModel = () => {
        setFormData(getInitialFormData);
        setValidated(false);
        setCountryId(0);
        setTitle("Add New Country");
        setButtonName("Add Country");
        setShowModal(true);
    };

    //handling delete operation
    const openConfirmation = (id) => {
        setConfirmBox(true);
        setCountryId(id);
    }

    //Defining columns for the table
    const columns = [
        { field: "index", headerName: "S.no", width: 100, cellClassName: "centered-cell" },
        { field: "countryName", headerName: "Country Name", flex: 1 },
        { field: "countryDesc", headerName: "Country Description", flex: 2 },
        { field: "continent", headerName: "Continent", flex: 1 },
        {
            field: "noOfStates", headerName: "Total States", flex: 1,
            renderCell: (params) => (
                <div className="d-flex align-items-center">
                    <span className="p-0 fs-5">{params.row.noOfStates}</span>
                    <FontAwesomeIcon
                        className="text-warning mx-4 fs-5"
                        style={{ cursor: "pointer" }}
                        icon={faEye}
                        onClick={() => openFaqList(params.row)}
                        title="View States list"
                    />
                </div>
            )
        },
        {
            field: "action", headerName: "Action", width: 100,
            renderCell: (params) => (
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <FontAwesomeIcon
                        className="text-warning"
                        style={{ cursor: "pointer" }}
                        icon={faPencil}
                        onClick={() => openEditPopUp(params.row)}
                    />
                    <FontAwesomeIcon
                        className="text-danger mx-4"
                        style={{ cursor: "pointer" }}
                        icon={faTrash}
                        onClick={() => openConfirmation(params.row.id)}
                    />
                </div>
            )
        },
    ];
    return (
        <>
            <DashboardHeader
                buttonName={"Add Country"}
                heading={"Manage Countries"}
                functionName={openAddModel}
            />
            <div className="mt-5">
                <DataTable columns={columns} list={list} />
            </div>

            {/* Modal for adding a new city */}
            <GenerateForm
                buttonName={buttonName}
                formData={formData}
                inputFields={inputFields}
                setButtonName={setButtonName}
                setShowLoading={setShowLoading}
                setShowModal={setShowModal}
                setValidated={setValidated}
                showLoading={showLoading}
                showModal={showModal}
                title={title}
                validated={validated}
                setFormData={setFormData}
                api={"country/add-update"}
            />
            <CommonModal
                api={`${process.env.NEXT_PUBLIC_API_URL}country/delete/${countryId}`}
                confirmBox={confirmBox}
                setConfirmBox={setConfirmBox}            
            />
        </>
    )
}