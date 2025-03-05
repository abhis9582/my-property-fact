"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonModel from "../common-model/common-model";

export default function CityHeaders() {
  // Defining states
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(null);
  const [allHeadersList, setAllHeadersList] = useState([]);
  const [headerId, setHeaderId] = useState(0);
  const [confirmBox, setConfirmBox] = useState(false);
  const [api, setApi] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    headerDisplayName: "",
    prority: null,
    subHeader: "",
  });
  //Object for page content text
  const pageObject = {
    pageHeading: "Manage Insight Headers",
    headingbuttonName: "+ Add new header",
  };

  //Handle chaning form value
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Handle model opening closing
  const openAddModel = () => {
    setButtonName("Add header");
    setTitle("Add new header");
    setValidated(false);
    setShowModal(true);
    setFormData({
        id: 0,
        headerDisplayName: "",
        prority: null,
        subHeader: "",
    });
  };

  //Handle Edit Model
  const openEditModel = async (item) => {
    setButtonName("Update header");
    setTitle("Edit new header");
    setValidated(false);
    setShowModal(true);
    setFormData({
      id: item.id,
      headerDisplayName: item.headerDisplayName,
      subHeader: item.subHeader,
    });
  };

  //Handle confirmation Box
  const openConfirmationBox = (id) => {
    setConfirmBox(true);
    setApi(`${process.env.NEXT_PUBLIC_API_URL}headers/delete/${id}`);
  };

  //Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        if (headerId > 0) {
          formData.id = headerId;
        }
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}headers/post`,
          formData
        );
        if (response.data.isSuccess === 1) {
          toast.success(response.data.message);
          setShowModal(false);
          fetchAllHeadersList();
        }
      } catch (error) {
        toast.error(error);
      }
    }
    setValidated(true);
  };
  const fetchAllHeadersList = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}headers/get`
    );
    if (response) {
      setAllHeadersList(response.data);
    }
  };
  useEffect(() => {
    fetchAllHeadersList();
  }, []);
  return (
    <div>
      <div className="d-flex justify-content-between mt-3">
        <p className="h1 ">{pageObject.pageHeading}</p>
        <Button className="mx-3" onClick={() => openAddModel()}>
          {pageObject.headingbuttonName}
        </Button>
      </div>
      <Table className="mt-5" striped bordered hover variant="light">
        <thead className="text-center">
          <tr>
            <th>S no</th>
            <th>Header Display Name</th>
            <th>Priority</th>
            <th>Sub Header</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allHeadersList.map((item, index) => (
            <tr className="text-center" key={`${item.headerName}-${index}`}>
              <td>{index + 1}</td>
              <td>{item.headerDisplayName}</td>
              <td>{item.priority}</td>
              <td>{item.subHeader}</td>
              <td>
                <div className="d-flex justify-content-around">
                  <FontAwesomeIcon
                    className="text-warning cursor-pointer"
                    icon={faPencil}
                    onClick={() => openEditModel(item)}
                  />
                  <FontAwesomeIcon
                    className="text-danger cursor-pointer"
                    icon={faTrash}
                    onClick={() => openConfirmationBox(item.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Modal for adding a new header */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="headerName">
              <Form.Label>Header Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter header name"
                name="headerDisplayName"
                onChange={(e) => handleChange(e)}
                value={formData.headerDisplayName || ""}
                required
              />
              <Form.Control.Feedback type="invalid">
                Header name is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="subHeaderName">
              <Form.Label>Sub header name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter sub header name"
                name="subHeader"
                onChange={(e) => handleChange(e)}
                value={formData.subHeader || ""}
              />
              <Form.Control.Feedback type="invalid">
                Sub header name is required
              </Form.Control.Feedback>
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Control type="text" name="prority" />
              <Form.Control.Feedback type="invalid">
                Priority is required
              </Form.Control.Feedback>
            </Form.Group> */}
            <Button variant="primary" type="submit">
              {buttonName}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
      {/* Pass the necessary props to CommonModel */}
      <CommonModel
        confirmBox={confirmBox}
        setConfirmBox={setConfirmBox}
        api = {api}
        fetchAllHeadersList={fetchAllHeadersList} 
      />
    </div>
  );
}
