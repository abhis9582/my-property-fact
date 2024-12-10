"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ProjectTypes() {
  const [showModal, setShowModal] = useState(false);
  const [projectType, setProjectType] = useState("");
  const [typeList, setTypeList] = useState([]);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const [projectTypeDesc, setProjectTypeDesc] = useState("");
  const [id, setId] = useState(0);
  // Function to handle form submission (you can replace it with your own logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const data = {
      projectTypeName: projectType,
      projectTypeDesc: projectTypeDesc,
      id: 0,
    };
    if (id > 0) {
      data.id = id;
    }
    if (form.checkValidity() === true) {
      try {
        // Make API request
        const response = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + "project-types/add-update",
          data
        );
        // Check if response is successful
        if (response.data.isSuccess === 1) {
          fetchProjectTypes();
          setShowModal(false); // Close modal or handle success
          toast.success(response.data.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };
  const fetchProjectTypes = async () => {
    const types = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "project-types/get-all"
    );
    if (types) {
      setTypeList(types.data);
    }
  };
  useEffect(() => {
    fetchProjectTypes();
  }, []);
  const openEditPopUp = (data) => {
    setId(data.id);
    setProjectType(data.projectTypeName);
    setProjectTypeDesc(data.projectTypeDesc);
    setTitle("Edit Project Type");
    setButtonName("Update Type");
    setShowModal(true);
  };
  const openAddModel = () => {
    setProjectType("");
    setId(0);
    setTitle("Add New Project Type");
    setButtonName("Add Type");
    setShowModal(true);
  };
  return (
    <div>
      <div className="d-flex justify-content-between mt-3">
        <p className="h1 ">Manage Project Types</p>
        <Button className="mx-3" onClick={() => openAddModel()}>
          + Add new Project Type
        </Button>
      </div>
      <Table className="mt-5" striped bordered hover variant="light">
        <thead>
          <tr>
            <th>S no</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {typeList.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.projectTypeName}</td>
              <td>
                <div>
                  <FontAwesomeIcon
                    className="mx-3 text-danger"
                    style={{ cursor: "pointer" }}
                    icon={faTrash}
                  />
                  <FontAwesomeIcon
                    className="text-warning"
                    style={{ cursor: "pointer" }}
                    icon={faPencil}
                    onClick={() => openEditPopUp(item)}
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
            <Form.Group className="mb-3" controlId="formCityName">
              <Form.Label>Project Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Type"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Type is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="12"
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Project Type Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="builderDesc"
                value={projectTypeDesc || ""}
                onChange={(e) => setProjectTypeDesc(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {buttonName}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}
