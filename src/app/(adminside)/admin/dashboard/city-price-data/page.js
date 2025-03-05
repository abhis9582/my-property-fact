"use client";

import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function CityPriceData() {
  const [cityList, setCityList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [validated, setValidated] = useState(null);
  const [buttonName, setButtonName] = useState("");
  const [confirmBox, setConfirmBox] = useState("");
  const [category, setCategory] = useState([]);
  const [aggregationFrom, setAggregationFrom] = useState([]);
  const [cityPriceList, setCityPriceList] = useState([]);
  const [updateId, setUpdateId] = useState(0);
  const [formData, setFormData] = useState({
    id: 0,
    city: "",
    noOfProjects: "",
    noOfTransactions: "",
    locationUrl: "",
    currentRate: "",
    changeValue: "",
    categoryId: "",
    aggregationFromId: "",
  });

  const fetchAllCities = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}city/all`
    );
    if (response) {
      setCityList(response.data);
    }
  };
  const fetchAllCategories = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}category/get`
    );
    if (response) {
      setCategory(response.data);
    }
  };
  const fetchAllAggigationFrom = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}aggregationFrom/get`
    );
    if (response) {
      setAggregationFrom(response.data);
    }
  };
  // Handle open add new form
  const openAddModel = () => {
    setShowModal(true);
    setTitle("Add City Price Data");
    setButtonName("Add");
    resetForm();
  };
  // Handle opening confirm dialog
  const openConfirmationDialog = (id) => {
    setUpdateId(id);
  };

  // Handle open edit model
  const openEditPopUp = (item) => {
    let cityId = 0;
    let aggregationFromId = 0;
    let categoryId = 0;
    aggregationFrom.map((i) => {
      if (i.aggregationFrom === item.aggregationFrom) {
        aggregationFromId = i.id;
      }
    });
    cityList.map((i) => {
      if (i.name === item.cityName) {
        cityId = i.id;
      }
    });
    category.map((i) => {
      if (i.category === item.category) {
        categoryId = i.id;
      }
    });
    setFormData({
      ...item,
      aggregationFromId: cityId,
      categoryId: categoryId,
      city: cityId,
      changeValue: item.changeValue.replace(/[+₹-]/g, "").trim(),
      currentRate: item.currentRate.replace(/[+₹,-]|common/g, "").trim(),
      noOfProjects: item.noOfProjects.replace(/,/g, "").trim(),
      noOfTransactions: item.noOfTransactions.replace(/,/g, "").trim(),
    });
    setShowModal(true);
    setButtonName("Update")
    setTitle("Update city price");
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        if(updateId > 0){
            formData.id = updateId;
        }
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}city-price-detail/post`,
          formData
        );
        if (response.data.isSuccess === 1) {
          toast.success(response.data.message);
          setShowModal(false);
          fetchCityPriceList();
        }
      } catch (error) {
        toast.error(error);
      }
    }
    setValidated(true);
  };

  // fetch list of city prices
  const fetchCityPriceList = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}city-price-detail/get`
    );
    if (response) {
      setCityPriceList(response.data);
    }
  };
  // Reset form
  const resetForm = () => {
    setFormData({
      aggregationFromId: "",
      city: "",
      noOfProjects: "",
      noOfTransactions: "",
      locationUrl: "",
      currentRate: "",
      changeValue: "",
      categoryId: "",
    });
    setValidated(false);
  };
  useEffect(() => {
    fetchAllCities();
    fetchAllAggigationFrom();
    fetchAllCategories();
    fetchCityPriceList();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between mt-3">
        <p className="h1 ">Manage Cities Price Data</p>
        <Button className="mx-3" onClick={() => openAddModel()}>
          + Add new data
        </Button>
      </div>
      <Table className="mt-5" striped bordered hover variant="light">
        <thead>
          <tr>
            <th>S no</th>
            <th>City Name</th>
            <th>Change Percentage</th>
            <th>Change Value</th>
            <th>Current Rate</th>
            <th>Location Url</th>
            <th>No Of Projects</th>
            <th>No Of Transactions</th>
            <th>Aggregation From</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cityPriceList.map((item, index) => (
            <tr key={`row-${index}`}>
              <td>{index + 1}</td>
              <td>{item.cityName}</td>
              <td
                style={{
                  color: item.changePercentage.startsWith("+")
                    ? "green"
                    : "red",
                }}
              >
                {item.changePercentage}
              </td>
              <td
                style={{
                  color: item.changeValue.startsWith("+") ? "green" : "red",
                }}
              >
                {item.changeValue}
              </td>
              <td>{item.currentRate}</td>
              <td>{item.locationUrl}</td>
              <td>{item.noOfProjects}</td>
              <td>{item.noOfTransactions}</td>
              <td>{item.aggregationFrom}</td>
              <td>{item.category}</td>
              <td>
                <div>
                  <FontAwesomeIcon
                    className="mx-3 text-danger"
                    style={{ cursor: "pointer" }}
                    icon={faTrash}
                    onClick={() => openConfirmationDialog(item.id)}
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
            <Row>
              <Col md={6}>
                <Form.Group md="4" controlId="price-data-city">
                  <Form.Label>Select City</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option></option>
                    {cityList.map((item) => (
                      <option
                        className="text-uppercase"
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    City is required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="price-data-no-of-projects"
                >
                  <Form.Label>No of projects</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter no of projects"
                    name="noOfProjects"
                    value={formData.noOfProjects}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    No of projects is required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="price-data-no-of-transactions"
                >
                  <Form.Label>No of transactions</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter no of transactions"
                    name="noOfTransactions"
                    value={formData.noOfTransactions}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    No of transactions is required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="price-data-location-url"
                >
                  <Form.Label>Location Url</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter location url"
                    name="locationUrl"
                    value={formData.locationUrl}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Location url is required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="price-data-change-value"
                >
                  <Form.Label>Current Rate</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter current rate"
                    name="currentRate"
                    value={formData.currentRate}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Current rate is required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="price-data-change-value"
                >
                  <Form.Label>Change value</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter change value"
                    name="changeValue"
                    value={formData.changeValue}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Change value is required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group
                  md="4"
                  className="mb-3"
                  controlId="price-data-category"
                >
                  <Form.Label>Select Category</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option></option>
                    {category.map((item) => (
                      <option
                        className="text-uppercase"
                        key={item.id}
                        value={item.id}
                      >
                        {item.category}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Category is required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  md="4"
                  className="mb-3"
                  controlId="price-data-aggregation-from"
                >
                  <Form.Label>Select Aggregation From</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    name="aggregationFromId"
                    value={formData.aggregationFromId || ""}
                    onChange={handleChange}
                    required
                  >
                    <option></option>
                    {aggregationFrom.map((item) => (
                      <option
                        className="text-uppercase"
                        key={item.id}
                        value={item.id}
                      >
                        {item.aggregationFrom}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Aggregation From is required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

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
          <Button variant="danger">Delete</Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}
