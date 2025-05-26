"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import CommonModal from "../common-model/common-model";
import DataTable from "../common-model/data-table";
import DashboardHeader from "../common-model/dashboardHeader";
import { useRouter } from "next/navigation";
export default function ManageFloorPlans({ list, projectsList }) {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [buttonName, setButtonName] = useState("");
    const [validated, setValidated] = useState(false);
    const [projectId, setProjectId] = useState("");
    const [planType, setPlanType] = useState("");
    const [area, setArea] = useState("");
    const [floorId, setFloorId] = useState(0);
    const [confirmBox, setConfirmBox] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setValidated(false);
        setButtonName("Add Floor Plan");
        setTitle("Add Floor Plan");
        setShow(true);
        setProjectId(0);
        setPlanType("");
        setArea("");
        setFloorId(0);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        if (form.checkValidity() === true) {
            let data = {
                projectId: projectId,
                planType: planType,
                areaSqft: area,
            };
            if (floorId > 0) {
                data.id = floorId;
            }
            try {
                setShowLoading(true);
                setButtonName("");
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}floor-plans/add-update`,
                    data
                );
                if (response.data.isSuccess == 1) {
                    toast.success(response.data.message);
                    router.refresh();
                    setShow(false);
                }
            } catch (error) {
                console.log("Error Occured", error);
                toast.error("Error Occured");
            } finally {
                setShowLoading(false);
                setButtonName("Add Floor Plan");
            }
        }
    };


    const openEditModel = (item) => {
        setTitle("Update Floor Plan");
        setButtonName("Update");
        setShow(true);
        setProjectId(item.projectId);
        setArea(item.areaSq);
        setPlanType(item.type);
        setFloorId(item.floorId);
    };
    const openConfirmationBox = (id) => {
        setConfirmBox(true);
        setFloorId(id);
    };

    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 70, cellClassName: "centered-cell" },
        { field: "pname", headerName: "Project Name", width: 300 },
        { field: "type", headerName: "Type", width: 300 },
        {
            field: "areaSq",
            headerName: "Area(sqft)",
            width: 280,
        },
        {
            field: "areaMt",
            headerName: "Area(mt)",
            width: 280,
        },
        {
            field: "action",
            headerName: "Action",
            width: 140,
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
                        onClick={() => openEditModel(params.row)}
                    />
                </div>
            ),
        },
    ];
    return (
        <div>
            <DashboardHeader buttonName={"+ Add Floor Plan"} functionName={handleShow} heading={"Manage Floor Plans"} />
            <div className="table-container mt-5">
                <DataTable columns={columns} list={list} />
            </div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="selectProject">
                            <Form.Label>Select Project</Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                onChange={(e) => setProjectId(e.target.value)}
                                value={projectId}
                                required
                            >
                                <option value="">Select Project</option>
                                {projectsList.map((item) => (
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
                        <Form.Group md="4" controlId="floorPlan">
                            <Form.Label>Floor Plan</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Plan name"
                                value={planType}
                                onChange={(e) => setPlanType(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Floor Plan is required !
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group md="4" controlId="enterArea">
                            <Form.Label>Enter Area</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Area(sqft)"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Area is required !
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button className="mt-3 btn btn-success" type="submit" disabled={showLoading}>
                            {buttonName} <LoadingSpinner show={showLoading} />
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <CommonModal
                api={`${process.env.NEXT_PUBLIC_API_URL}floor-plans/delete/${floorId}`}
                confirmBox={confirmBox}
                setConfirmBox={setConfirmBox}
            />
        </div>
    );
}
