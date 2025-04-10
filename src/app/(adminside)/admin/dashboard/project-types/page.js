"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
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
  const [showLoading, setShowLoading] = useState(false);
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
        setShowLoading(true);
        setButtonName("");
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
      }finally{
        setShowLoading(false);
        id > 0 ? setButtonName("Update Type") : setButtonName("Add Type");
      }
    }
  };
  const fetchProjectTypes = async () => {
    const types = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "project-types/get-all"
    );
    if (types) {
      const res = types.data;
      const list = res.map((item, index) => ({
        ...item,
        index: index + 1,
      }));
      setTypeList(list);
    }
  };
  const deleteProjectType = async () => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/delete/${id}`
    );
    if (response.data.isSuccess === 1) {
      setConfirmBox(false);
      fetchProjectTypes();
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };
  const openConfirmationBox = (id) => {
    setConfirmBox(true);
    setId(id);
  };
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
    setTitle("Add Project Type");
    setButtonName("Add Type");
    setValidated(false);
    setShowModal(true);
  };

  //Defining table columns
  const columns = [
    { field: "index", headerName: "S.no", width: 100 },
    { field: "projectTypeName", headerName: "Project Type Name", width: 250 },
    { field: "metaTitle", headerName: "Meta Title", width: 246 },
    { field: "metaDesc", headerName: "Meta Description", width: 200 },
    { field: "metaKeyword", headerName: "Meta Keyword", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
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
        <p className="h1 ">Manage Project Types</p>
        <Button className="mx-3 btn btn-success" onClick={() => openAddModel()}>
          + Add Project Type
        </Button>
      </div>
      <div className="table-container mt-5">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={typeList}
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
            <Form.Group className="mb-3" controlId="projectType">
              <Form.Label>Project Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Project type"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Project type is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="projectTypeMetaTitle">
              <Form.Label>Meta Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Meta title"
                value={metaTitle || ""}
                onChange={(e) => setMetaTitle(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Meta title is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="ProjectTypeDescription">
              <Form.Label>Project Type Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Project type description"
                name="builderDesc"
                value={projectTypeDesc || ""}
                onChange={(e) => setProjectTypeDesc(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Project type description is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="projectTypeMetaDescription"
            >
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaDesc"
                placeholder="Meta description"
                value={metaDesc || ""}
                onChange={(e) => setMetaDesc(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Project type meta description is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="proejctTypeMetaKeyword"
            >
              <Form.Label>Meta Keyword</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaKeyword"
                value={metaKeyword || ""}
                placeholder="Meta Keyword"
                onChange={(e) => setMetaKeyword(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Meta Keyword is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Button className="btn btn-success" type="submit" disabled={showLoading}>
              {buttonName} <LoadingSpinner show={showLoading}/>
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
    </div>
  );
}
