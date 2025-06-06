"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import CommonModal from "../common-model/common-model";
import DataTable from "../common-model/data-table";
import GenerateForm from "../common-model/generateForm";
import DashboardHeader from "../common-model/dashboardHeader";
export default function Builder({ list }) {
    //Defining from fields for builder
    const inputFields = [
        {
            id: "builderName",
            label: "Builder name"
        },
        {
            id: "builderDesc",
            label: "Builder description"
        },
        {
            id: "metaTitle",
            label: "Meta title"
        },
        {
            id: "metaKeyword",
            label: "Meta keyword"
        },
        {
            id: "metaDesc",
            label: "Meta description"
        },
    ];

    const getInitialFormData = () =>
        Object.fromEntries(inputFields.map(item => [item.id, '']));
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [buttonName, setButtonName] = useState("");
    const [validated, setValidated] = useState(false);
    const [id, setId] = useState(0);
    const [confirmBox, setConfirmBox] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [formData, setFormData] = useState(getInitialFormData);

    //Handling opening of edit builer form
    const openEditPopUp = (data) => {
        setFormData({
            ...data,
            id: data.id
        });
        setTitle("Edit Builder");
        setButtonName("Update Builder");
        setShowModal(true);
    };

    //Handling opening of new add builder form
    const openAddModel = () => {
        setValidated(false);
        setFormData(getInitialFormData);
        setTitle("Add Builder");
        setButtonName("Add Builder");
        setShowModal(true);
    };

    const openConfirmationBox = (id) => {
        setConfirmBox(true);
        setId(id);
    };

    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 100, cellClassName: "centered-cell" },
        { field: "builderName", headerName: "Builder Name", width: 180 },
        { field: "metaTitle", headerName: "Meta title", width: 150 },
        {
            field: "metaKeyword",
            headerName: "Meta Keyword",
            width: 400,
        },
        {
            field: "metaDesc",
            headerName: "Meta Description",
            width: 420,
        },
        {
            field: "action",
            headerName: "Action",
            width: 110,
            renderCell: (params) => (
                <div>
                    <FontAwesomeIcon
                        className="mx-3 text-danger"
                        style={{ cursor: "pointer" }}
                        icon={faTrash}
                        onClick={() => openConfirmationBox(params.row.id)}
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
            <DashboardHeader buttonName={"+ Add Builder"} functionName={openAddModel} heading={"Manage Builders"} />
            <div className="table-container mt-5">
                <DataTable columns={columns} list={list} />
            </div>
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
                api={"builders/add-update"}
            />
            <CommonModal
                api={`${process.env.NEXT_PUBLIC_API_URL}builders/delete/${id}`}
                confirmBox={confirmBox}
                setConfirmBox={setConfirmBox}
            />
        </div>
    );
}
