"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function ImageUrlPopup({ confirmBox, setConfirmBox }) {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState(null);
    const [buttonName, setButtonName] = useState("Submit");
    const [showLoading, setShowLoading] = useState(false);

    //Handle setting input fields values
    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        if (type === "file") {
            setFormData((prevState) => ({
                ...prevState,
                [name]: files[0],
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    //handling form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        if (form.checkValidity() === true) {
        }
    }

    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 50 },
        {
            field: "blogImage", headerName: "Blog Image", width: 120,
            renderCell: (params) => (
                <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}blog/${params.row.blogImage}`}
                    alt="Project"
                    width={100}
                    height={50}
                    style={{ borderRadius: '5px' }}
                    unoptimized
                />
            ),
        },
        {
            field: "blogKeywords",
            headerName: "Keywords",
            width: 200,
        },
        { field: "blogTitle", headerName: "Title", width: 200 },
        { field: "blogMetaDescription", headerName: "Meta Description", width: 200 },
        { field: "blogDescription", headerName: "Description", width: 200 },
        { field: "slugUrl", headerName: "Url", width: 200 },
        { field: "blogCategory", headerName: "Category", width: 200 },
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => (
                <div>
                    <FontAwesomeIcon
                        className="mx-3 text-danger cursor-pointer"
                        style={{ cursor: "pointer" }}
                        icon={faTrash}
                    // onClick={() => openConfirmationBox(params.row.id)}
                    />
                    <FontAwesomeIcon
                        className="text-warning"
                        style={{ cursor: "pointer" }}
                        icon={faPencil}
                    // onClick={() => openEditModel(params.row)}
                    />
                </div>
            ),
        },
    ];

    const paginationModel = { page: 0, pageSize: 10 };
    return (
        <Modal show={confirmBox} onHide={() => setConfirmBox(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Copy image url to add in blog</Modal.Title>
            </Modal.Header>
            <div>
                <div className="d-flex justify-content-between mt-3">
                    <p className="h1 ">{pageObject.pageHeading}</p>
                    <Button className="mx-3 btn btn-success" onClick={() => openAddModel()}>
                        {pageObject.headingbuttonName}
                    </Button>
                </div>
                <div className="table-container mt-5">
                    <Paper sx={{ height: 550, width: "100%" }}>
                        <DataGrid
                            rows={allHeadersList}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[10, 15, 20, 50]}
                            checkboxSelection
                            sx={{
                                border: 0,
                                "& .MuiDataGrid-columnHeader": {
                                    fontWeight: "bold", // Make headings bold
                                    fontSize: "16px", // Optional: Adjust size
                                    backgroundColor: "#68ac78", // Optional: Light background
                                },
                            }}
                        />
                    </Paper>
                </div>
                {/* Modal for adding a new header */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="headerName">
                                <Form.Label>Category Display Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter category display name"
                                    name="categoryDisplayName"
                                    onChange={(e) => handleChange(e)}
                                    value={formData.categoryDisplayName || ""}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Category Display name is required
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="subHeaderName">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter category"
                                    name="category"
                                    onChange={(e) => handleChange(e)}
                                    value={formData.category || ""}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Category is required
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button className="btn btn-success" type="submit" disabled={showLoading}>
                                {buttonName} <LoadingSpinner show={showLoading} />
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/* Pass the necessary props to CommonModal */}
                <CommonModal
                    confirmBox={confirmBox}
                    setConfirmBox={setConfirmBox}
                    api={api}
                    fetchAllHeadersList={fetchAllHeadersList}
                />
            </div>
        </Modal>
    )
}