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
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [confirmBox, setConfirmBox] = useState(false);
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
      metaDesc: metaDesc,
      metaKeyword: metaKeyword,
      metaTitle: metaTitle,
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
  const deleteProjectType = async () =>{
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}project-types/delete/${id}`);
    if(response.data.isSuccess === 1){
        setConfirmBox(false);
        fetchProjectTypes();
        toast.success(response.data.message);
    }else{
      toast.error(response.data.message);
    }
  }
  const openConfirmationBox = (id) =>{
    setConfirmBox(true);
    setId(id);
  }
  useEffect(() => {
    fetchProjectTypes();
  }, []);
  const openEditPopUp = (data) => {
    setId(data.id);
    setProjectType(data.projectTypeName);
    setProjectTypeDesc(data.projectTypeDesc);
    setMetaDesc(data.metaDesc);
    setMetaTitle(data.metaTitle);
    setMetaKeyword(data.metaKeyword);
    setTitle("Edit Project Type");
    setButtonName("Update Type");
    setShowModal(true);
  };
  const openAddModel = () => {
    setProjectType("");
    setId(0);
    setMetaDesc("");
    setMetaTitle("");
    setMetaKeyword("");
    setProjectTypeDesc("");
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
            <th>Meta Title</th>
            <th>Meta Description</th>
            <th>Meta Keyword</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {typeList.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.projectTypeName}</td>
              <td>{item.metaTitle}</td>
              <td>{item.metaDesc}</td>
              <td>{item.metaKeyword}</td>
              <td>
                <div>
                  <FontAwesomeIcon
                    className="mx-3 text-danger"
                    style={{ cursor: "pointer" }}
                    icon={faTrash}
                    onClick={()=>openConfirmationBox(item.id)}
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
            <Form.Group className="mb-3" controlId="formCityName">
              <Form.Label>Meta Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Type"
                value={metaTitle || ""}
                onChange={(e) => setMetaTitle(e.target.value)}
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
            <Form.Group
              as={Col}
              md="12"
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaDesc"
                value={metaDesc || ""}
                onChange={(e) => setMetaDesc(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="12"
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Meta Keyword</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaKeyword"
                value={metaKeyword || ""}
                onChange={(e) => setMetaKeyword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
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
          <Button variant="danger" onClick={deleteProjectType}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}
