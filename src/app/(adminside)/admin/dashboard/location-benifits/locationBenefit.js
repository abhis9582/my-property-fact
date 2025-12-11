"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import CommonModal from "../common-model/common-model";
import DashboardHeader from "../common-model/dashboardHeader";
import DataTable from "../common-model/data-table";
import { useRouter } from "next/navigation";
export default function LocationBenefit({ list, projectList }) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [buttonName, setButtonName] = useState("");
    const [validated, setValidated] = useState(false);
    const [projectId, setProjectId] = useState("");
    const [bName, setBname] = useState("");
    const [distance, setDistance] = useState("");
    const [icon, setIcon] = useState("");
    const [confirmBox, setConfirmBox] = useState(false);
    const [id, setId] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);
    const [showLoading, setShowLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (form.checkValidity() === true) {
            try {
                const formData = new FormData();
                formData.append("iconImage", icon);
                formData.append("benefitName", bName);
                formData.append("distance", distance);
                formData.append("projectId", projectId);
                if (id > 0) {
                    formData.append("id", id);
                }
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}location-benefit/add-new`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (response.data.isSuccess == 1) {
                    router.refresh();
                    setShowModal(false);
                    toast.success(response.data.message);
                }
            } catch (error) {
                toast.error("Error occured");
            } finally {
                setShowLoading(false);
                setButtonName("Add");
            }
        }
        setValidated(true);
    };

    const handleFileChange = (e) => {
        setIcon(e.target.files[0]);
    };

    const openAddModel = () => {
        setShowModal(true);
        setDistance("");
        setBname("");
        setIcon(null);
        setPreviewImage(null);
        setProjectId(0);
        setTitle("Add New Location Benefit");
        setButtonName("Add");
        setValidated(false);
    };

    const openEditModel = (item) => {
        setShowModal(true);
        setDistance(item.distance);
        setBname(item.benefitName);
        setIcon(null);
        setProjectId(item.projectId);
        setId(item.id);
        setPreviewImage(`/icon/${item.image}`);
        setTitle("Edit Location Benefit");
        setButtonName("Updte");
    };

    const openConfirmationBox = (id) => {
        setConfirmBox(true);
        setId(id);
    };

    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 100 },
        { field: "projectName", headerName: "Project Name", flex: 1 },
        {
            field: "image",
            headerName: "Benefit Image",
            flex: 1,
            renderCell: (params) => (
                <>
                    {
                        params.row.image.map((item, index) => (
                            <Image
                                className="mx-2"
                                key={index}
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${params.row.slugUrl}/${item}`}
                                alt="Project"
                                width={50}
                                height={50}
                            />
                        ))
                    }
                </>
            ),
        },
        {
            field: "benefitName",
            headerName: "Benefit Name",
            flex: 1,
        },
        {
            field: "distance",
            headerName: "Distance",
            flex: 1,
        },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            renderCell: (params) => (
                <div>
                    <Button className="btn btn-sm btn-success"
                    onClick={() => openConfirmationBox(params.row.id)}>
                        View All
                    </Button>
                </div>
            ),
        },
    ];
    return (
        <>
            <DashboardHeader buttonName={'+ Add New'} functionName={openAddModel} heading={'Manage Location Benefits'} />
            <div className="table-container">
                <DataTable columns={columns} list={list.map(item => ({
                    ...item,
                    image: item.locationBenefits.map(item => item.image),
                    distance: item.locationBenefits.map(item => item.distance),
                    benefitName: item.locationBenefits.map(item => item.benefitName),
                }))} />
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        {previewImage && (
                            <Image src={previewImage} alt="image" width={50} />
                        )}
                        <Form.Group controlId="selectIcon" className="mb-3">
                            <Form.Label>Select icon</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Form.Group controlId="selectPorject">
                            <Form.Label>Select Project</Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                onChange={(e) => setProjectId(e.target.value)}
                                value={projectId}
                                required
                            >
                                <option value="">Select Project</option>
                                {projectList.map((item) => (
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
                        <Form.Group className="mb-3" controlId="benefitName">
                            <Form.Label>Benefit Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Benefit name"
                                value={bName}
                                onChange={(e) => setBname(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Benefit name is required !
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="distance">
                            <Form.Label>Distance(in KM)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Distance"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Distance is required !
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button className="btn btn-success" type="submit" disabled={showLoading}>
                            {buttonName} <LoadingSpinner show={showLoading} />
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <CommonModal confirmBox={confirmBox} setConfirmBox={setConfirmBox} api={`${process.env.NEXT_PUBLIC_API_URL}location-benefit/delete/${id}`} />
        </>
    );
}
