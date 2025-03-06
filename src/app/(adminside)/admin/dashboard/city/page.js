"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
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
  const [confirmBox, setConfirmBox] = useState(false);
  const [cityId, setCityId] = useState(0);
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
      const res = cities.data;
      const modifiedCityList = res.map((city, index) => ({
        ...city,
        index: index + 1, // Assign serial number starting from 1
      }));
      setCityList(modifiedCityList);
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
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeyWord("");
    setId(0);
    setTitle("Add New City");
    setButtonName("Add City");
    setShowModal(true);
  };
  const deleteCity = async () => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}city/delete/${cityId}`
    );
    setCityId(0);
    setConfirmBox(false);
    fetchCities();
  };
  const openConfirmationDialog = (id) => {
    setConfirmBox(true);
    setCityId(id);
  };
  //Defining table columns
  const columns = [
    { field: "index", headerName: "S.no", width: 70 },
    { field: "name", headerName: "City Name", width: 180 },
    { field: "state", headerName: "State", width: 150 },
    {
      field: "metaTitle",
      headerName: "Meta Title",
      width: 150,
    },
    {
      field: "metaKeyWords",
      headerName: "Meta Keyword",
      width: 239,
    },
    {
      field: "metaDescription",
      headerName: "Meta Description",
      width: 260,
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <div>
          <FontAwesomeIcon
            className="mx-3 text-danger"
            style={{ cursor: "pointer" }}
            icon={faTrash}
            onClick={() => openConfirmationDialog(params.row.id)}
          />
          <FontAwesomeIcon
            className="text-warning"
            style={{ cursor: "pointer" }}
            icon={faPencil}
            onClick={() => openEditPopUp(params.row)}
          />
        </div>
      ),
    },
  ];
  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div>
      <div className="d-flex justify-content-between mt-3">
        <p className="h1 ">Manage Cities</p>
        <Button className="mx-3" onClick={() => openAddModel()}>
          + Add new city
        </Button>
      </div>
      <div className="table-container mt-5">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={cityList}
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
                onChange={(e) => setMetaTitle(e.target.value)}
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
                onChange={(e) => setMetaDescription(e.target.value)}
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
          <Button variant="danger" onClick={deleteCity}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}
