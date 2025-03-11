"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Form, Modal, Table } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function ManageProjectAbout() {
  const editor = useRef(null);
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [aboutList, setAboutList] = useState([]);
  const [aboutId, setAboutId] = useState(0);
  const [confirmBox, setConfirmBox] = useState(false);
  // Helper function to remove HTML tags and truncate the text
  const removeHtmlTagsAndTruncate = (text, limit = 200) => {
    // Remove HTML tags using a regex
    const textWithoutHtml = text.replace(/<[^>]+>/g, "");

    // Truncate the text to the specified limit and add '...' if it's too long
    return textWithoutHtml.length > limit
      ? textWithoutHtml.slice(0, limit) + "..."
      : textWithoutHtml;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      shortDesc: shortDesc,
      longDesc: longDesc,
      projectId: projectId,
    };
    if (aboutId > 0) {
      data.id = aboutId;
    }
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}project-about/add-update`,
      data
    );
    if (response.data.isSuccess === 1) {
      toast.success(response.data.message);
      setShowModal(false);
      fetchProjectsAbout();
    } else {
      toast.error(response.data.message);
    }
  };
  const fetchProjects = async () => {
    const projectResponse = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "projects/get-all"
    );
    if (projectResponse) {
      setProjectList(projectResponse.data);
    }
  };
  const openAddModel = () => {
    setShowModal(true);
    setTitle("Add Project About");
    setProjectId(0);
    setShortDesc("");
    setLongDesc("");
    setAboutId(0);
  };
  const openEditModel = (item) => {
    setShowModal(true);
    setTitle("Edit Project About");
    setProjectId(item.projectId);
    setShortDesc(item.shortDesc);
    setLongDesc(item.longDesc);
    setAboutId(item.id);
  };
  const fetchProjectsAbout = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-about/get`
    );
    const res = response.data;
    const list = res.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    setAboutList(list);
  };
  const openConfirmationBox = (id) => {
    setAboutId(id);
    setConfirmBox(true);
  };
  const deletePrjectAbout = async () => {
    if (aboutId > 0) {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}project-about/delete/${aboutId}`
      );
      if (response.data.isSuccess === 1) {
        toast.success(response.data.message);
        fetchProjectsAbout();
        setConfirmBox(false);
      } else {
        toast.error("Something went wrong...");
      }
    }
  };
  useEffect(() => {
    fetchProjects();
    fetchProjectsAbout();
  }, []);

  //Defining table columns
  const columns = [
    { field: "id", headerName: "S.no", width: 100 },
    { field: "projectName", headerName: "Project Name", width: 250 },
    { field: "shortDesc", headerName: "Short Description", width: 600 },
    { field: "longDesc", headerName: "Long Description", width: 600 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="gap-3">
          <FontAwesomeIcon
            className="text-danger mx-2"
            style={{ cursor: "pointer" }}
            icon={faTrash}
            onClick={() => openConfirmationBox(params.row.id)}
          />
          <FontAwesomeIcon
            className="text-warning pointer mx-2"
            style={{ cursor: "pointer" }}
            icon={faPencil}
            onClick={() => openEditModel(params.row)}
          />
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mt-3">
        <p className="h1 ">Manage Project About</p>
        <Button className="btn btn-success" onClick={openAddModel}>
          + Add
        </Button>
      </div>
      <div className="table-container mt-5">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={aboutList}
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
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group md="4" controlId="validationCustom01">
              <Form.Label>Select Project</Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setProjectId(e.target.value)}
                value={projectId}
              >
                <option>Select Project</option>
                {projectList.map((item) => (
                  <option
                    className="text-uppercase"
                    key={item.id}
                    value={item.id}
                  >
                    {item.projectName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCityName">
              <Form.Label>Write short description</Form.Label>
              <JoditEditor
                ref={editor}
                value={shortDesc}
                onChange={(newcontent) => setShortDesc(newcontent)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCityName">
              <Form.Label>Write long description</Form.Label>
              <JoditEditor
                ref={editor}
                value={longDesc}
                onChange={(newcontent) => setLongDesc(newcontent)}
              />
            </Form.Group>
            <Button className="btn btn-success" type="submit">
              Submit
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
          <Button variant="danger" onClick={deletePrjectAbout}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}
