"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ManageGallery() {
  const [projectList, setProjectList] = useState([]);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [galleryImage, setGalleryImage] = useState("");
  const [galleryList, setGalleryList] = useState([]);
  const [show, setShow] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const handleShow = () => {
    setShow(true);
    setButtonName("Add");
  };
  const fetchProjects = async () => {
    const projectResponse = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "projects/get-all"
    );
    if (projectResponse) {
      setProjectList(projectResponse.data);
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setGalleryImage(selectedFile);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("image", galleryImage);
    try {
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
    }
  };
  const fetchGalleryImage = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-gallery/get-all`
    );
    const res = response.data;
    const list = res.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    setGalleryList(list);
  };
  useEffect(() => {
    fetchProjects();
    fetchGalleryImage();
  }, []);

  //Handle delete
  const openConfirmationBox = (id) => {
    setConfirmBox(true);
  };

  //Handle edit
  const openEditModel = (item) => {
    setShow(true);
    setButtonName("Update");
  };
  //Defining table columns
  const columns = [
    { field: "id", headerName: "S.no", width: 100 },
    { field: "pname", headerName: "Project Name", width: 180 },
    {
      field: "image",
      headerName: "Gallery Image",
      width: 600,
      renderCell: (params) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${params.row.slugURL}/${params.row.image}`}
          alt={`${params.row.pname}`}
          width={100}
          height={50}
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
    <div className="container_fluid">
      <div className="mt-3 d-flex justify-content-between">
        <p className="h1">Manage Project&apos;s Gallery</p>
        <Button className="btn btn-success mb-2" onClick={handleShow}>
          + Add Gallery Image
        </Button>
      </div>
      <div className="table-container mt-5">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={galleryList}
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
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Gallery Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group md="4" controlId="validationCustom01">
              <Form.Label>Select Project</Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option>Select Project</option>
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
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3 mt-3">
              <Form.Label>Select Gallery Image</Form.Label>
              <Form.Control type="file" onChange={(e) => handleFileChange(e)} />
            </Form.Group>
            <Button className="mt-3 btn btn-success" type="submit">
              {buttonName}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={confirmBox} onHide={() => setConfirmBox(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete ?</Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body> */}
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={() => setConfirmBox(false)}>
            Close
          </Button>
          <Button variant="danger">
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}
