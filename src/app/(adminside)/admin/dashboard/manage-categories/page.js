"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import CommonModal from "../common-model/common-model";

export default function ManageBlogCategory() {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("Add New Blog Category");
    const [buttonName, setButtonName] = useState("Submit");
    const [showLoading, setShowLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({});
    const [confirmBox, setConfirmBox] = useState(false);
    const [catId, setCatId] = useState(0);
    const [categoryList, setCategoryList] = useState([]);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    //Handling opening of add model
    const openAddModel = () => {
        setShowModal(true);
        setValidated(false);
    }

    //setting formdata
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // Fetching all categories list
    const fetchCategoryList = async () => {
        try {
            const response = await axios.get(`${apiUrl}blog-category/get-all`);
            const data = response.data;

            // Add index and set the entire list once
            const updatedList = data.map((item, index) => ({
                ...item,
                index: index + 1,
            }));

            setCategoryList(updatedList); // Set the full list once
        } catch (error) {
            console.error("Error fetching blog categories:", error);
        }
    };

    // Handle deletion of blog category
    const openConfirmationBox = (id) => {
        setConfirmBox(true);
        setCatId(id);
    }

    //Handle submitting blog category form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        } else {
            setShowLoading(true);
            setButtonName("");
            try {
                const response = await axios.post(`${apiUrl}blog-category/add-update`, formData);
                if (response.status === 200) {
                    setShowModal(false);
                    setValidated(false);
                    setFormData({});
                    fetchCategoryList(); // Fetch the updated list after adding
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error adding blog category:", error);
                toast.error("Error adding blog category. Please try again.");
            }finally{
                setShowLoading(false);
                setButtonName("Submit");
            }
        }
    }
    //Handling edition of Blog category
    const openEditModel = (item) => {
        setShowModal(true);
        setTitle("Edit Blog Category");
        setButtonName("Update Blog Category");
        setFormData(item);
    }
    useEffect(() => {
        fetchCategoryList();
    }, []);

    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 100 },
        {
            field: "categoryName",
            headerName: "Category Name",
            width: 450,
        },
        { field: "categoryDescription", headerName: "Category Description", width: 400 },
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
        <div>
            <div className="d-flex justify-content-between align-items-center my-4">
                <h1>Manage Blog Categories</h1>
                <Button className="btn btn-success" onClick={openAddModel}>
                    + Add New Category
                </Button>
            </div>
            {/* Table containing all the blog categories */}
            <div className="table-container">
                <Paper sx={{ height: 550, width: "100%" }}>
                    <DataGrid
                        rows={categoryList}
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
            {/* Add/Edit Modal Component would go here */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="blog_category_name">
                            <Form.Label>Blog category Name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter Category"
                                name="categoryName"
                                value={formData.categoryName || ""}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">Blog category name is required!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="validationCustom02">
                            <Form.Label>Category Description</Form.Label>
                            <Form.Control
                                as={"textarea"}
                                rows={5}
                                required
                                placeholder="Enter description"
                                name="categoryDescription"
                                value={formData.categoryDescription || ""}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">Category description is required!</Form.Control.Feedback>
                        </Form.Group>
                        <Button className="mt-3 btn btn-success" type="submit" disabled={showLoading}>
                            {buttonName} <LoadingSpinner show={showLoading} />
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <CommonModal confirmBox={confirmBox} setConfirmBox={setConfirmBox}
            api={`${apiUrl}blog-category/delete/${catId}`} fetchAllHeadersList={fetchCategoryList}/>
        </div>
    );
}