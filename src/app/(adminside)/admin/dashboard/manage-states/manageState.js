"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashboardHeader from "../common-model/dashboardHeader";
import DataTable from "../common-model/data-table";
import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import GenerateForm from "../common-model/generateForm";
import CommonModal from "../common-model/common-model";
import { useRouter } from "next/navigation";

export default function ManageState({ countryList, stateList }) {
    const inputFields = [
        {
            id: "stateName",
            label: "State Name",
            type: "text"
        },
        {
            id: "countryId",
            label: "Country",
            type: "select",
            list: countryList
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
    const [stateId, setStateId] = useState(0);
    const [confirmBox, setConfirmBox] = useState(false);
    const router = useRouter();

    //Handeling opening of edit model
    const openEditPopUp = (data) => {
        setTitle("Edit State");
        setButtonName("Update State");
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
        setStateId(0);
        setTitle("Add New State");
        setButtonName("Add State");
        setShowModal(true);
    };

    //handling delete operation
    const openConfirmation = (id) => {
        setConfirmBox(true);
        setStateId(id);
    }

    //Defining columns for the table
    const columns = [
        { field: "index", headerName: "S.no", width: 100, cellClassName: "centered-cell" },
        { field: "stateName", headerName: "State Name", flex: 1 },
        { field: "description", headerName: "State Description", flex: 2 },
        { field: "countryName", headerName: "State Name", flex: 1 },
        {
            field: "noOfCities", headerName: "Total Cities", flex: 1,
            renderCell: (params) => (
                <div className="d-flex align-items-center">
                    <span className="p-0 fs-5">{params.row.noOfCities}</span>
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
                buttonName={"Add State"}
                heading={"Manage States"}
                functionName={openAddModel}
            />
            <div className="mt-5">
                <DataTable columns={columns} list={stateList} />
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
                api={"state/add-update"}
            />
            <CommonModal
                api={`${process.env.NEXT_PUBLIC_API_URL}state/delete/${stateId}`}
                confirmBox={confirmBox}
                setConfirmBox={setConfirmBox}
            />
        </>
    )
}