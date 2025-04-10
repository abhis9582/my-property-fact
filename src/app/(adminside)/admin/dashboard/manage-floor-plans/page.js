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
export default function ManageFloorPlans() {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [planType, setPlanType] = useState("");
  const [area, setArea] = useState("");
  const [floorPlanList, setFloorPlanList] = useState([]);
  const [floorId, setFloorId] = useState(0);
  const [confirmBox, setConfirmBox] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setValidated(false);
    setButtonName("Add Floor Plan");
    setTitle("Add Floor Plan");
    setShow(true);
    setProjectId(0);
    setPlanType("");
    setArea("");
    setFloorId(0);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (form.checkValidity() === true) {
      let data = {
        projectId: projectId,
        planType: planType,
        areaSqft: area,
      };
      if (floorId > 0) {
        data.id = floorId;
      }
      try {
        setShowLoading(true);
        setButtonName("");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}floor-plans/add-update`,
          data
        );
        if (response.data.isSuccess == 1) {
          toast.success(response.data.message);
          fetchAllFloorPlans();
          setShow(false);
        }
      } catch (error) {
        console.log("Error Occured", error);
        toast.error("Error Occured");
      } finally {
        setShowLoading(false);
        setButtonName("Add Floor Plan");
      }
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
  const fetchAllFloorPlans = async () => {
    const floorPlans = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "floor-plans/get-all"
    );
    if (floorPlans) {
      const res = floorPlans.data;
      const list = res.map((item, index) => ({
        ...item,
        index: index + 1,
        id: item.floorId,
        areaMt: item.areaMt.toFixed(2)
      }));
      setFloorPlanList(list);
    }
  };
  const openEditModel = (item) => {
    setTitle("Update Floor Plan");
    setButtonName("Update");
    setShow(true);
    setProjectId(item.projectId);
    setArea(item.areaSq);
    setPlanType(item.type);
    setFloorId(item.floorId);
  };
  const openConfirmationBox = (id) => {
    setConfirmBox(true);
    setFloorId(id);
  };
  const deleteFloorPlan = async () => {
    if (floorId > 0) {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}floor-plans/delete/${floorId}`
      );
      if (response) {
        toast.success("Deleted successfully...");
        setFloorId(0);
        setConfirmBox(false);
        fetchAllFloorPlans();
      }
    }
  };
  useEffect(() => {
    fetchProjects();
    fetchAllFloorPlans();
  }, []);

  //Defining table columns
  const columns = [
    { field: "index", headerName: "S.no", width: 70 },
    { field: "pname", headerName: "Project Name", width: 300 },
    { field: "type", headerName: "Type", width: 150 },
    {
      field: "areaSq",
      headerName: "Area(sqft)",
      width: 200,
    },
    {
      field: "areaMt",
      headerName: "Area(mt)",
      width: 200,
    },
    {
      field: "action",
      headerName: "Action",
      width: 275,
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
            onClick={() => openEditModel(params.row)}
          />
        </div>
      ),
    },
  ];
  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div>
      <div className="mt-3 d-flex justify-content-between">
        <p className="h1">Manage Floor Plans</p>
        <Button className="btn btn-success mb-2" onClick={handleShow}>
          + Add Floor Plan
        </Button>
      </div>
      <div className="table-container mt-5">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={floorPlanList}
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
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="selectProject">
              <Form.Label>Select Project</Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setProjectId(e.target.value)}
                value={projectId}
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
            <Form.Group md="4" controlId="floorPlan">
              <Form.Label>Floor Plan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Plan name"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Floor Plan is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group md="4" controlId="enterArea">
              <Form.Label>Enter Area</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Area(sqft)"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Area is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Button className="mt-3 btn btn-success" type="submit" disabled={showLoading}>
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
          <Button variant="danger" onClick={deleteFloorPlan}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
