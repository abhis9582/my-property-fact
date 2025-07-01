"use client";
import { useState } from "react";
import DashboardHeader from "../common-model/dashboardHeader";
import DataTable from "../common-model/data-table";
import GenerateForm from "../common-model/generateForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function ManageLocality({ cityList }) {
    const inputFields = [
        {
            id: "localityName",
            label: "Locality Name",
            type: "text",
        },
        {
            id: "cityId",
            label: "City",
            type: "select",
            list: cityList
        },
        {
            id: "averagePricePerSqFt",
            label: "Average Price / sqft",
            type: "number",
        },
        {
            id: "description",
            label: "Locality Description",
            type: "textarea",
        },
    ];
    const getInitialFormData = () =>
        Object.fromEntries(inputFields.map(item => [item.id, ""]));
    const [validated, setValidated] = useState(false);
    const [showModel, setShowModel] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [buttonName, setButtonName] = useState(null);
    const [formData, setFormData] = useState(getInitialFormData);
    const [title, setTitle] = useState(null);
    const [cityId, setCityId] = useState(0);

    //Handeling opening of add model
    const openAddModel = () => {
        setFormData(getInitialFormData);
        setValidated(false);
        setCityId(0);
        setTitle("Add New Locality");
        setButtonName("Add Locality");
        setShowModel(true);
    };

    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 100, cellClassName: "centered-cell" },
        { field: "localityName", headerName: "Locality Name", flex: 1 },
        { field: "cityName", headerName: "City Name", flex: 1 },
        { field: "stateName", headerName: "State Name", flex: 1 },
        { field: "description", headerName: "Locality Description", flex: 1 },
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
        <>
            {/* header section  */}
            <DashboardHeader
                buttonName={"Add New Locality"}
                functionName={openAddModel}
                heading={"Manage Localities"}
            />

            {/* table section  */}
            <div className="mt-5">
                <DataTable columns={columns} list={[]} />
            </div>

            {/* form section  */}
            <GenerateForm
                api={"locality/add-update"}
                buttonName={buttonName}
                formData={formData}
                inputFields={inputFields}
                setButtonName={setButtonName}
                setFormData={setFormData}
                setShowLoading={setShowLoading}
                setShowModal={setShowModel}
                setValidated={setValidated}
                showLoading={showLoading}
                showModal={showModel}
                title={title}
                validated={validated}
            />
        </>
    )
}