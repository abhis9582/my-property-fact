"use client";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Modal,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Image from "next/image";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import CommonModal from "../common-model/common-model";
export default function Aminities() {
  const [showModal, setShowModal] = useState(false);
  const [amenityList, setAmenityList] = useState([]);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const [previousImage, setPreviousImage] = useState("");
  const [confirmBox, setConfirmBox] = useState(false);
  const [amenityId, setAmenityId] = useState(0);
  const [showLoading, setShowLoading] = useState(false);

  //Fetching all amenities list
  const fetchAmenities = async () => {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "amenity/get-all"
    );
    const res = response.data;
    const list = res.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
    setAmenityList(list);
  };
  useEffect(() => {
    fetchAmenities();
  }, []);
  const [formData, setFormData] = useState({
    title: "",
    altTag: "",
    amenityImage: null,
  });

  //Saving the amenity data
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }
    if (form.checkValidity() === true) {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("altTag", formData.altTag);
      formDataToSend.append("amenityImage", formData.amenityImage);
      if (formData.id > 0) {
        formDataToSend.append("id", formData.id);
      }
      try {
        setShowLoading(true);
        const response = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + "amenity/post",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.isSuccess == 1) {
          setFormData({
            title: "",
            altTag: "",
            amenityImage: null,
          });
          setShowModal(false);
          fetchAmenities();
        }
      } catch (error) {
        console.error("Error submitting data", error);
      } finally {
        setShowLoading(false);
      }
    }
  };
  // Handle image file selection
  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      amenityImage: files[0],
    }));
  };

  // Handle change for text input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Handle confirmation dilog
  const openConfirmationBox = (id) => {
    setConfirmBox(true);
    setAmenityId(id);
  };

  //Handling opening of add popup
  const openAddModel = () => {
    setFormData({
      title: "",
      altTag: "",
      amenityImage: null,
    });
    setPreviousImage(null);
    setTitle("Add New Amenity");
    setButtonName("Add Amenity");
    setShowModal(true);
    setValidated(false);
  };

  //Handling opening of edit model
  const openEditModel = (item) => {
    setTitle("Edit Amenity");
    setButtonName("Update Amenity");
    setFormData({
      ...item,
      amenityImage: null,
    });
    setShowModal(true);
    setPreviousImage(
      `${process.env.NEXT_PUBLIC_IMAGE_URL}amenity/${item.amenityImageUrl}`
    );
  };

  //Defining table columns
  const columns = [
    { field: "index", headerName: "S.no", width: 100 },
    { field: "title", headerName: "Title", width: 180 },
    {
      field: "image",
      headerName: "Amenity Image",
      width: 600,
      renderCell: (params) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}amenity/${params.row.amenityImageUrl}`}
          alt={params.row.title || ""}
          width={50}
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
  //Defining pagination for table
  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mt-3">
        <p className="h1">Manage Amenities</p>
        <Button className="btn btn-success mx-3" onClick={openAddModel}>
          + Add new amenity
        </Button>
      </div>
      <div className="table-container mt-5">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={amenityList}
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
      {/* Modal for adding a new city */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                className="mb-3"
                md="12"
                controlId="validationCustom01"
              >
                <Form.Control
                  required
                  type="text"
                  placeholder="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                className="mb-3"
                md="12"
                controlId="validationCustom02"
              >
                <Form.Control
                  required
                  type="text"
                  placeholder="Alt Tag"
                  name="altTag"
                  value={formData.altTag}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              {previousImage && (
                <div>
                  <Image
                    src={previousImage}
                    alt="previous image"
                    width={100}
                    height={100}
                  />
                  <br />
                </div>
              )}
              <Form.Group
                as={Col}
                className="mb-3"
                md="12"
                controlId="validationCustomUsername"
              >
                <InputGroup hasValidation>
                  <Form.Control
                    type="file"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend"
                    name="amenityImage"
                    onChange={handleFileChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a Image.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Button className="btn btn-success" type="submit" disabled={showLoading}>{buttonName} <LoadingSpinner show={showLoading} /></Button>
          </Form>
        </Modal.Body>
      </Modal>
      <CommonModal confirmBox={confirmBox} setConfirmBox={setConfirmBox} api={`${process.env.NEXT_PUBLIC_API_URL}amenity/delete/${amenityId}`} fetchAllHeadersList={fetchAmenities} />
      <ToastContainer />
    </div>
  );
}
