"use client";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import CommonModal from "../common-model/common-model";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import DataTable from "../common-model/data-table";
import DashboardHeader from "../common-model/dashboardHeader";
export default function ManageGallery({ list, projectsList }) {
    const [title, setTitle] = useState("");
    const [buttonName, setButtonName] = useState("");
    const [validated, setValidated] = useState(false);
    const [projectId, setProjectId] = useState("");
    const [galleryImage, setGalleryImage] = useState("");
    const [show, setShow] = useState(false);
    const [confirmBox, setConfirmBox] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [galleryId, setGalleryId] = useState(0);
    const handleShow = () => {
        setShow(true);
        setButtonName("Add");
        setTitle("Add Gallery Image");
        setValidated(false);
    };

    //Handling file chnaging
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setGalleryImage(selectedFile);
    };

    //Handling submitting gallery images
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("projectId", projectId);
        formData.append("image", galleryImage);
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        if (form.checkValidity() === true) {
            try {
                setShowLoading(true);
                setButtonName("");
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}project-gallery/add-new`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (response.status == 200) {
                    toast.success(response.data.message);
                    fetchGalleryImage();
                    setShow(false);
                }
            } catch (error) {
                console.log("Error Occured", error);
            } finally {
                setShowLoading(false);
                setButtonName("Add");
            }
        }
    };

    //Handle delete
    const openConfirmationBox = (id) => {
        setGalleryId(id);
        setConfirmBox(true);
    };
    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 100, cellClassName: "centered-cell" },
        { field: "pname", headerName: "Project Name", width: 500 },
        {
            field: "image",
            headerName: "Gallery Image",
            width: 500,
            renderCell: (params) => (
                <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${params.row.slugURL}/${params.row.image}`}
                    alt={`${params.row.pname}`}
                    width={100}
                    height={50}
                    unoptimized
                />
            ),
        },
        {
            field: "action",
            headerName: "Action",
            width: 270,
            renderCell: (params) => (
                <div>
                    <FontAwesomeIcon
                        className="mx-3 text-danger"
                        style={{ cursor: "pointer" }}
                        icon={faTrash}
                        onClick={() => openConfirmationBox(params.row.id)}
                    />
                </div>
            ),
        },
    ];
    return (
        <div className="container_fluid">
            <DashboardHeader buttonName={"+ Add Gallery Image"} functionName={handleShow} heading={"Manage Project's Gallery"} />
            <div className="table-container mt-5">
                <DataTable columns={columns} list={list} />
            </div>
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group md="4" controlId="selectProject">
                            <Form.Label>Select Project</Form.Label>
                            <Form.Select
                                aria-label="Default select example"
                                onChange={(e) => setProjectId(e.target.value)}
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
                        <Form.Group controlId="formFile" className="mb-3 mt-3">
                            <Form.Label>Select Gallery Image</Form.Label>
                            <Form.Control type="file" onChange={(e) => handleFileChange(e)} required />
                            <Form.Control.Feedback type="invalid">
                                Gallery image is required !
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button className="mt-3 btn btn-success" type="submit" disabled={showLoading}>
                            {buttonName} <LoadingSpinner show={showLoading} />
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <CommonModal confirmBox={confirmBox} setConfirmBox={setConfirmBox} api={`${process.env.NEXT_PUBLIC_API_URL}project-gallery/delete/${galleryId}`} />
        </div>
    );
}
