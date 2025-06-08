"use client";
import axios from "axios";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Multiselect from "multiselect-react-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import CommonModal from "../common-model/common-model";
import { useRouter } from "next/navigation";
import DashboardHeader from "../common-model/dashboardHeader";
import DataTable from "../common-model/data-table";
export default function ProjectsAmenity({ projectList, amenityList }) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [validated, setValidated] = useState(false);
    const [projectId, setProjectId] = useState("");
    const [buttonName, setButtonName] = useState("");
    const [confirmBox, setConfirmBox] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState([]);
    const [showAmenityError, setShowAmenityError] = useState(false);
    const [projectListOptions, setProjectListOptions] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);

    // Handler for selecting an option
    const onSelect = (selectedList) => {
        setSelectedValue(selectedList); // Update selected values state
    };
    // Handler for removing an option
    const onRemove = (removedList) => {
        setSelectedValue(removedList); // Update selected values state
    };
    const openAddModel = () => {
        setIsDisabled(false);
        setProjectListOptions(projectList.filter(item => item.amenities.length === 0));
        setValidated(false);
        setShowAmenityError(false);
        setShowModal(true);
        setTitle("Add New Amenity");
        setButtonName("Add");
        setSelectedValue([]);
        setProjectId(0);
    };

    //Handling submitting form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = {
            amenityList: selectedValue,
            projectId: projectId,
        };
        if (form.checkValidity() === false || selectedValue.length === 0) {
            e.stopPropagation();
            if (selectedValue.length === 0) {
                setShowAmenityError(true);
            }
        } else {
            try {
                setShowLoading(true);
                setButtonName("");
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}projects/add-update-amenity`,
                    data
                );
                if (response.data.isSuccess === 1) {
                    router.refresh();
                    toast.success(response.data.message);
                    setShowModal(false);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error);
            } finally {
                setShowLoading(false);
                setButtonName("Add");
            }
        }
        setValidated(true);
    };

    const openConfirmationBox = (id) => {
        setConfirmBox(true);
        setProjectId(id);
    };

    const openEditPopUp = async (item) => {
        setProjectListOptions(projectList);
        setIsDisabled(true);
        setShowModal(true);
        setTitle("Update Project Amenity");
        setButtonName("Update");
        setSelectedValue(item.amenities);
        setProjectId(item.id);
    };

    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 100, cellClassName: "centered-cell" },
        { field: "projectName", headerName: "Project Name", flex: 1 },
        { field: "amenitiesName", headerName: "Amenities", flex: 1 },
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params) => (
                <div>
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
            <DashboardHeader
                buttonName={"+ Add Project Amenity"}
                functionName={openAddModel}
                heading={"Manage Project & Amenity"}
            />
            <div className="table-container mt-5">
                <DataTable columns={columns} list={projectList.filter(item => item.amenities.length > 0)} />
            </div>
            {/* Modal for adding a new city */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="selectAmenityForProject">
                            <Form.Label>Select Project</Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                onChange={(e) => setProjectId(e.target.value)}
                                value={projectId}
                                required
                                disabled={isDisabled}
                            >
                                <option value="">Select Project</option>
                                {projectListOptions.map((item) => (
                                    <option
                                        className="text-uppercase"
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.projectName}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Project is required !
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Select Amenities</Form.Label>
                            <Multiselect
                                options={amenityList}
                                selectedValues={selectedValue}
                                onSelect={onSelect}
                                onRemove={onRemove}
                                displayValue="title"
                                className={showAmenityError ? "border border-danger rounded rounded-1" : ""}
                            />
                            {showAmenityError && (
                                <div className="text-danger mt-1">At least one amenity is required!</div>
                            )}
                        </Form.Group>
                        <Button className="mt-3 btn btn-success" type="submit" disabled={showLoading}>
                            {buttonName} <LoadingSpinner show={showLoading} />
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <CommonModal
                api={`${process.env.NEXT_PUBLIC_API_URL}project-amenity/delete/${projectId}`}
                confirmBox={confirmBox}
                setConfirmBox={setConfirmBox}
            />
        </>
    );
}
