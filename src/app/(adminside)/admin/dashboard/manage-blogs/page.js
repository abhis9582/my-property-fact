"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

import dynamic from 'next/dynamic';
import { toast } from "react-toastify";
// 🔥 This prevents SSR errors
const Editor = dynamic(() => import('../common-model/joe-editor'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

export default function ManageBlogs() {
    const editor = useRef(null);
    const config = {
        readonly: false,
        placeholder: 'Start typing...',
    };

    const [blogList, setBlogList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("Add New Blog");
    const [buttonName, setButtonName] = useState("Submit");
    const [showLoading, setShowLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [blogDescription, setBlogDescription] = useState("");
    const [blogCategoryList, setBlogCategoryList] = useState([]);
    const [blogId, setBlogId] = useState(0);
    const [value, setValue] = useState('');
    //Definign input fields for blog form

    const inputFields = {
        blogTitle: "",
        metaKeyword: "",
        blogDescription: "",
        blogCategory: "",
        blogImage: "",
        blogDescription: "",
        slugUrl: "",
        id: 0,
    };

    const [formData, setFormData] = useState(inputFields);

    //Handle submitting blog form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        if (form.checkValidity() === true) {
            setShowLoading(true);
            if (blogId > 0) {
                formData.id = blogId;
            }
            const data = new FormData();
            data.append("blogTitle", formData.blogTitle);
            data.append("metaKeyword", formData.metaKeyword);
            data.append("blogDescription", blogDescription);
            data.append("blogCategory", formData.blogCategory);
            data.append("image", formData.blogImage);
            data.append("slugUrl", formData.slugUrl);
            data.append("id", formData.id);

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}blog/add-update`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                
                if (response.data.status) {
                    toast.success(response.data.message);
                    // setShowModal(false);
                    // fetchBlogs();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {            
                toast.error(error.response.data.error);
            } finally {
                setShowLoading(false);
            }
        }
    }

    //Handle deletion of blog
    const openConfirmationBox = (id) => {

    }

    //Handling edition of Blog
    const openEditModel = (item) => {

    }

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

    //Handle opening of add blog form
    const openAddModel = () => {
        setShowModal(true);
        setValidated(false);
    }

    //Fetching all blogs categories
    const fetchBlogCategory = async () => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}blog-category/get-all`);
        setBlogCategoryList(response.data);
    }
    useEffect(() => {
        fetchBlogCategory();
    }, []);

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
                    {/* <FontAwesomeIcon
                        className="mx-3 text-danger"
                        style={{ cursor: "pointer" }}
                        icon={faTrash}
                        onClick={() => openConfirmationBox(params.row.id)}
                    /> */}
                    {/* <FontAwesomeIcon
                        className="text-warning"
                        style={{ cursor: "pointer" }}
                        icon={faPencil}
                        onClick={() => openEditModel(params.row)}
                    /> */}
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
            <div className="table-container mt-5" style={{ width: '100%', height: 400 }}>
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
            <Modal size="xl" show={showModal} onHide={() => setShowModal(false)} centered enforceFocus={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="blogTitle">
                                <Form.Label>Meta Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Meta title"
                                    name="blogTitle"
                                    value={formData.metaTitle}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="metaKeyword">
                                <Form.Label>Meta Keyword</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Meta keyword"
                                    name="metaKeyword"
                                    value={formData.metaKeyword}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group controlId="blogDescription">
                                <Form.Label>Meta Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Meta description"
                                    name="blogDescription"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="blogCategory">
                                <Form.Label>Blog category</Form.Label>
                                <Form.Select
                                    name="blogCategory"
                                    value={formData.blogCategory}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {blogCategoryList.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.categoryName}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="blogImage">
                                <Form.Label>Blog Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    placeholder="Choose file"
                                    name="blogImage"
                                    onChange={handleChange}
                                // required
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group controlId="slugUrl">
                                <Form.Label>Slug Url</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Slug url"
                                    name="slugUrl"
                                    value={formData.slugUrl}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            {/* <Form.Group className="mb-3" controlId="writeBlogDescription"> */}
                            <Form.Label>Write blog description</Form.Label>
                            {/* <JoditEditor
                                    ref={editor}
                                    value={blogDescription}
                                    onChange={(newcontent) => setBlogDescription(newcontent)}
                                /> */}
                            <Editor value={blogDescription} onChange={setBlogDescription} />
                            {/* </Form.Group> */}
                        </Row>
                        <Button className="btn btn-success" type="submit" disabled={showLoading}>
                            Submit <LoadingSpinner show={showLoading} />
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}