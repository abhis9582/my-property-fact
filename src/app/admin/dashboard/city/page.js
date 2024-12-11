"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function City() {
  const [showModal, setShowModal] = useState(false);
  const [cityName, setCityName] = useState("");
  const [state, setState] = useState("");
  const [cityList, setCityList] = useState([]);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const [id, setId] = useState(0);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeyword, setMetaKeyWord] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
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
      name: cityName,
      state: state,
      metaTitle: metaTitle,
      metaKeyWords: metaKeyword,
      metaDescription: metaDescription,
      id: 0,
    };
    if (id > 0) {
      data.id = id;
    }
    if (form.checkValidity() === true) {
      try {
        // Make API request
        const response = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + "city/add-new",
          data
        );
        // Check if response is successful
        if (response.data.isSuccess === 1) {
          fetchCities();
          setShowModal(false); // Close modal or handle success
          toast.success(response.data.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };
  const fetchCities = async () => {
    const cities = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "city/all"
    );
    if (cities) {
      setCityList(cities.data);
    }
  };
  useEffect(() => {
    fetchCities();
  }, []);
  const openEditPopUp = (data) => {
    setId(data.id);
    setTitle("Edit City");
    setButtonName("Update City");
    setCityName(data.name);
    setState(data.state);
    setMetaTitle(data.metaTitle);
    setMetaDescription(data.metaDescription);
    setMetaKeyWord(data.metaKeyWords);
    setShowModal(true);
  };
  const openAddModel = () => {
    setCityName("");
    setState("");
    setId(0);
    setTitle("Add New City");
    setButtonName("Add City");
    setShowModal(true);
  };
  return (
    <div>
      <div className="d-flex justify-content-between mt-3">
        <p className="h1 ">Manage Cities</p>
        <Button className="mx-3" onClick={() => openAddModel()}>
          + Add new city
        </Button>
      </div>
      <Table className="mt-5" striped bordered hover variant="light">
        <thead>
          <tr>
            <th>S no</th>
            <th>City Name</th>
            <th>State</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cityList.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.state}</td>
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
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city name"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                City is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCityName">
              <Form.Label>State Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter state name"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                State is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="12"
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Meta Title</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaTitle"
                value={metaTitle || ""}
                onChange={(e)=>setMetaTitle(e.target.value)}
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
                onChange={(e) => setMetaKeyWord(e.target.value)}
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
                name="metaKeyword"
                value={metaDescription || ""}
                onChange={(e)=>setMetaDescription(e.target.value)}
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
