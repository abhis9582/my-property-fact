"use client";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Modal,
  Table,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
export default function Aminities() {
  const [showModal, setShowModal] = useState(false);
  const [amenityList, setAmenityList] = useState([]);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const fetchAmenities = async () => {
    const amenityList = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "amenity/get-all"
    );
    setAmenityList(amenityList.data);
  };
  useEffect(() => {
    fetchAmenities();
  }, []);
  const [formData, setFormData] = useState({
    title: "",
    altTag: "",
    amenityImage: null,
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("altTag", formData.altTag);
    formDataToSend.append("amenityImage", formData.amenityImage);
    try {
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
  const openAddModel = () => {
    setTitle("Add New Amenity");
    setButtonName("Add Amenity");
    setShowModal(true);
  };
  const openEditModel = (item) => {
    setTitle("Edit Amenity");
    setButtonName("Update Amenity");
    setShowModal(true);
  };
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mt-3">
        <p className="h1 ">Manage Aminities</p>
        <Button className="mx-3" onClick={openAddModel}>
          + Add new amenity
        </Button>
      </div>
      <Table className="mt-5" striped bordered hover variant="light">
        <thead>
          <tr>
            <th>S no</th>
            <th>Amenity Name</th>
            <th>Icon</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {amenityList.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>
                <img src={`/amenity/${item.amenityImageUrl}`} width={"50"} alt={item.altTag}/>
              </td>
              <td>
                <div>
                  <FontAwesomeIcon
                    className="mx-3 text-danger"
                    style={{ cursor: "pointer" }}
                    icon={faTrash}
                    // onClick={() => deleteBuilder(item)}
                  />
                  <FontAwesomeIcon
                    className="text-warning"
                    style={{ cursor: "pointer" }}
                    icon={faPencil}
                    onClick={() => openEditModel(item)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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
                    required
                    name="amenityImage"
                    onChange={handleFileChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a Image.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Button type="submit">
              {buttonName}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}
