"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Builder() {
  const [showModal, setShowModal] = useState(false);
  const [builder, setBuilder] = useState("");
  const [builderList, setBuilderList] = useState([]);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const [id, setId] = useState(0);
  const [builderDesc, setBuilderDesc] = useState("");
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
      builderName: builder,
      builderDesc: builderDesc,
      metaTitle: metaTitle,
      metaDesc: metaDesc,
      metaKeyword: metaKeyword,
      id: 0,
    };
    if (id > 0) {
      data.id = id;
    }
    if (form.checkValidity() === true) {
      try {
        // Make API request
        const response = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + "builders/add-update",
          data
        );
        // Check if response is successful
        if ((response.data.isSuccess = 1)) {
          fetchBuilders();
          setShowModal(false); // Close modal or handle success
          toast.success(response.data.message);
        } else {
          setShowModal(true);
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };
  const fetchBuilders = async () => {
    const builders = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "builders/get-all"
    );
    if (builders) {
      const res = builders.data.builders;
      const builderResult = res.map((res, index) => ({
        ...res,
        index: index + 1,
      }));
      setBuilderList(builderResult);
    }
  };
  useEffect(() => {
    fetchBuilders();
  }, []);
  const openEditPopUp = (data) => {
    setId(data.id);
    setTitle("Edit Builder");
    setButtonName("Update Builder");
    setBuilder(data.builderName);
    setBuilderDesc(data.builderDesc);
    setMetaDesc(data.metaDesc);
    setMetaKeyword(data.metaKeyword);
    setMetaTitle(data.metaTitle);
    setShowModal(true);
  };
  const openAddModel = () => {
    setBuilder("");
    setBuilderDesc("");
    setMetaDesc("");
    setMetaTitle("");
    setMetaKeyword("");
    setId(0);
    setTitle("Add New Builder");
    setButtonName("Add Builder");
    setShowModal(true);
  };
  const openConfirmationBox = (id) => {
    setConfirmBox(true);
    setId(id);
  };
  const deleteBuilder = async () => {
    try {
      if (id > 0) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}builders/delete/${id}`
        );
        if (response.data.isSuccess === 1) {
          toast.success(response.data.message);
          setConfirmBox(false);
          fetchBuilders();
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error + "Error occured !");
    }
  };

  //Defining table columns
  const columns = [
    { field: "index", headerName: "S.no", width: 100 },
    { field: "builderName", headerName: "Builder Name", width: 180 },
    { field: "metaTitle", headerName: "Meta title", width: 150 },
    {
      field: "metaKeyword",
      headerName: "Meta Keyword",
      width: 239,
    },
    {
      field: "metaDesc",
      headerName: "Meta Description",
      width: 260,
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
        <p className="h1 ">Manage Builders</p>
        <Button className="mx-3" onClick={() => openAddModel()}>
          + Add new builder
        </Button>
      </div>
      <div className="table-container mt-5">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={builderList}
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
              <Form.Label>Builder Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter builder name"
                value={builder || ""}
                onChange={(e) => setBuilder(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Builder name is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCityName">
              <Form.Label>Meta Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter meta title"
                value={metaTitle || ""}
                onChange={(e) => setMetaTitle(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Builder name is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="12"
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Builder Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="builderDesc"
                value={builderDesc || ""}
                onChange={(e) => setBuilderDesc(e.target.value)}
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
          <Button variant="danger" onClick={deleteBuilder}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}
