"use client";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

export default function ManageBlogs() {
    const [blogList, setBlogList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("Add New Blog");
    const [buttonName, setButtonName] = useState("Submit");
    const [showLoading, setShowLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    //Handle submitting blog form
    const handleSubmit = async (e) => {

    }
    //Handle deletion of blog
    const openConfirmationBox = (id) => {

    }

    //Handling edition of Blog
    const openEditModel = (item) => {

    }

    //Handle opening of add blog form
    const openAddModel = () => {
        setShowModal(true);
        setValidated(false);
    }

    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 100 },
        {
            field: "categoryDisplayName",
            headerName: "Category Display Name",
            width: 450,
        },
        { field: "category", headerName: "Category", width: 400 },
        {
            field: "action",
            headerName: "Action",
            width: 250,
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

    const paginationModel = { page: 0, pageSize: 10 };
    return (
        <>
            <div className="d-flex justify-content-between mt-3">
                <p className="h1">Manage Blogs</p>
                <Button className="mx-3 btn btn-success" onClick={openAddModel}>
                    + Add Blog
                </Button>
            </div>
            <div className="table-container mt-5">
                <Paper sx={{ height: 550, width: "100%" }}>
                    <DataGrid
                        rows={blogList}
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
            {/* Blog form */}
            <Modal size="xl" show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                                <Form.Label>Blog category</Form.Label>
                                <Form.Select>
                                    <option>Select category</option>
                                    <option>Category 1</option>
                                    <option>Category 2</option>
                                    <option>Category 3</option>
                                </Form.Select>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom02">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Last name"
                                    defaultValue="Otto"
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="First name"
                                    defaultValue="Mark"
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom02">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Last name"
                                    defaultValue="Otto"
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}