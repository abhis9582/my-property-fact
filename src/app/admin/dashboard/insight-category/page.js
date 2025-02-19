"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonModel from "../common-model/common-model";

export default function InsightCategory() {
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
    categoryDisplayName: "",
    category: "",
  });
  //Object for page content text
  const pageObject = {
    pageHeading: "Manage Insight Category",
    headingbuttonName: "+ Add new category",
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
    setButtonName("Add category");
    setTitle("Add new category");
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
    setButtonName("Update category");
    setTitle("Edit new category");
    setValidated(false);
    setShowModal(true);
    setFormData({
      id: item.id,
      categoryDisplayName: item.categoryDisplayName,
      category: item.category,
    });
  };

  //Handle confirmation Box
  const openConfirmationBox = (id) => {
    setConfirmBox(true);
    setApi(`${process.env.NEXT_PUBLIC_API_URL}category/delete/${id}`);
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
          `${process.env.NEXT_PUBLIC_API_URL}category/post`,
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
      `${process.env.NEXT_PUBLIC_API_URL}category/get`
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
            <th>Category Display Name</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allHeadersList.map((item, index) => (
            <tr className="text-center" key={`${item.headerName}-${index}`}>
              <td>{index + 1}</td>
              <td>{item.categoryDisplayName}</td>
              <td>{item.category}</td>
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
        api={api}
        fetchAllHeadersList={fetchAllHeadersList}
      />
    </div>
  );
}
