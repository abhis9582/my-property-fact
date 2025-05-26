"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import DataTable from "../common-model/data-table";
import DashboardHeader from "../common-model/dashboardHeader";
import CommonModal from "../common-model/common-model";
import GenerateForm from "../common-model/generateForm";
export default function City({ list }) {
    const inputFields = [
        {
            id: "name",
            label: "City Name",
        },
        {
            id: "state",
            label: "State Name",
        },
        {
            id: "metaTitle",
            label: "Meta Title",
        },
        {
            id: "metaKeyWords",
            label: "Meta Keywords",
        },
        {
            id: "metaDescription",
            label: "Meta Description",
        },
        {
            id: "cityDisc",
            label: "City Description",
        },
    ];
    const getInitialFormData = () =>
        Object.fromEntries(inputFields.map(item => [item.id, ""]));
    const [showModal, setShowModal] = useState(false);
    const [buttonName, setButtonName] = useState("");
    const [validated, setValidated] = useState(false);
    const [confirmBox, setConfirmBox] = useState(false);
    const [cityId, setCityId] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const [title, setTitle] = useState(null);

    const [formData, setFormData] = useState(getInitialFormData);

    //Handeling opening of edit model
    const openEditPopUp = (data) => {
        setTitle("Edit City");
        setButtonName("Update City");
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
        setCityId(0);
        setTitle("Add New City");
        setButtonName("Add City");
        setShowModal(true);
    };

    const openConfirmationDialog = (id) => {
        setConfirmBox(true);
        setCityId(id);
    };

    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 70, cellClassName: "centered-cell" },
        { field: "name", headerName: "City Name", width: 150 },
        { field: "state", headerName: "State", width: 150 },
        {
            field: "metaTitle",
            headerName: "Meta Title",
            width: 250,
        },
        {
            field: "metaKeyWords",
            headerName: "Meta Keyword",
            width: 295,
        },
        {
            field: "metaDescription",
            headerName: "Meta Description",
            width: 350,
        },
        {
            field: "action",
            headerName: "Action",
            width: 100,
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

    return (
        <div>
            <DashboardHeader heading={"Manage Cities"} buttonName={"+ Add new city"} functionName={openAddModel} />
            <div className="table-container mt-5">
                <DataTable list={list} columns={columns} />
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
                api= {"city/add-new"}
            />
            <CommonModal
                api={`${process.env.NEXT_PUBLIC_API_URL}city/delete/${cityId}`}
                confirmBox={confirmBox}
                setConfirmBox={setConfirmBox}
            />
        </div>
    );
}
