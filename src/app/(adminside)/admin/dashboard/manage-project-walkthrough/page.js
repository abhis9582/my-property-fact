"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import CommonModal from "../common-model/common-model";

// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function ManageProjectWalkthrough() {
  const editor = useRef(null);
  const [walkthroughDesc, setWalkthroughDesc] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [walkThroughList, setWalkThroughList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [confirmBox, setConfirmBox] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [walkthroughId, setWalkthroughId] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      walkthroughDesc: walkthroughDesc,
      projectId: projectId,
      id: 0
    };
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (form.checkValidity() === true) {
      if(walkthroughId > 0){
        data.id = walkthroughId;
      }
      try {
        setShowLoading(true);
        setButtonName("");
        const response = await axios.post(
          `${apiUrl}project-walkthrough/add-update`,
          data
        );
        if (response.data.isSuccess === 1) {
          toast.success(response.data.message);
          setShowModal(false);
          fetchProjects();
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setShowLoading(false);
        setButtonName("Add");
      }
    }
  };

  const fetchProjects = async () => {
    const apis = [
      axios.get(`${apiUrl}projects/get-all`),
      axios.get(`${apiUrl}project-walkthrough/get`),
    ];
    const [projectsRes, walkthroughRes] = await Promise.all(apis);
    const data = walkthroughRes.data;
    const list = data.map((item, index) => ({
      ...item,
      index: index + 1,
      projectName: item.slugURL.replace(/-/g, " "),
    }));
    setProjectList(projectsRes.data);
    setWalkThroughList(list);
  };
  //Handle open model
  const openAddModal = () => {
    setValidated(false);
    setShowModal(true);
    setTitle("Add Walkthrough");
    setButtonName("Add");
    setWalkthroughDesc(null);
    setProjectId(0);
  };

  //Handle deleting walkthrough
  const openConfirmationBox = (id) => {
    setConfirmBox(true);
    setWalkthroughId(id);
  };

  const openEditPopUp = (item) => {    
    setShowModal(true);
    setTitle("Update Walkthrough");
    setButtonName("Update");
    setWalkthroughDesc(item.walkthroughDesc);
    setProjectId(item.projectId);
    setWalkthroughId(item.id);
  };
  //Defining table columns
  const columns = [
    { field: "index", headerName: "S.no", width: 100 },
    { field: "projectName", headerName: "Project Name", width: 250 },
    { field: "walkthroughDesc", headerName: "Amenities", width: 600 },
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
            onClick={() => openEditPopUp(params.row)}
          />
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mt-3">
        <p className="h1">Manage Project Walkthrough</p>
        <Button className="btn btn-success" onClick={openAddModal}>
          + Add Walkthrough
        </Button>
      </div>
      {/* Show All data in tabular form */}
      <div className="table-container mt-5">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={walkThroughList}
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
              "& .MuiDataGrid-cell": {
                textTransform: "capitalize"
              },
            }}
          />
        </Paper>
      </div>
      {/* Model for adding walkthrough */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="selectProject">
              <Form.Label>Select Project</Form.Label>
              <Form.Select
                aria-label="projects"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
              >
                <option value="">Select Project</option>
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
              <Form.Control.Feedback type="invalid">
                Project is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 mt-4" controlId="formCityName">
              <Form.Label>Walkthrough description</Form.Label>
              <JoditEditor
                ref={editor}
                value={walkthroughDesc}
                onChange={(newcontent) => setWalkthroughDesc(newcontent)}
              />
            </Form.Group>
            <Button className="btn btn-success" type="submit" disabled={showLoading}>
              {buttonName} <LoadingSpinner show={showLoading} />
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <CommonModal confirmBox={confirmBox} setConfirmBox={setConfirmBox} api={`${process.env.NEXT_PUBLIC_API_URL}project-walkthrough/delete/${walkthroughId}`} fetchAllHeadersList={fetchProjects}/>
      <ToastContainer />
    </div>
  );
}
