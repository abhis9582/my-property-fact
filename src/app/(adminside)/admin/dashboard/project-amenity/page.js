"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Multiselect from "multiselect-react-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
export default function ProjectsAmenity() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [validated, setValidated] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [amenityList, setAmenityList] = useState([]);
  const [projectAmenityList, setProjectAmenityList] = useState([]);
  const [confirmBox, setConfirmBox] = useState(false);
  // State to store selected values
  const [selectedValue, setSelectedValue] = useState([]);
  console.log(selectedValue);

  // Handler for selecting an option
  const onSelect = (selectedList) => {
    setSelectedValue(selectedList); // Update selected values state
  };
  // Handler for removing an option
  const onRemove = (removedList) => {
    setSelectedValue(removedList); // Update selected values state
  };
  const openAddModel = () => {
    setShowModal(true);
    setTitle("Add New Amenity");
    setButtonName("Add");
    setSelectedValue([]);
    setProjectId(0);
  };
  const fetchProjects = async () => {
    const projectResponse = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "projects/get-all"
    );
    if (projectResponse) {
      setProjectList(projectResponse.data);
    }
  };
  const fetchAmenities = async () => {
    const amenityList = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "amenity/get-all"
    );
    setAmenityList(amenityList.data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      amenityList: selectedValue,
      projectId: projectId,
    };
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}project-amenity/add-update`,
      data
    );
    if (response.data.isSuccess === 1) {
      toast.success(response.data.message);
      setShowModal(false);
      fetchPrjectsAmenity();
    } else {
      toast.error(response.data.message);
    }
  };
  const deleteProjectAmenity = async () => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}project-amenity/delete/${projectId}`
    );
    if (response.data.isSuccess === 1) {
      toast.success(response.data.message);
      fetchPrjectsAmenity();
      setConfirmBox(false);
    } else {
      toast.error(response.data.message);
    }
  };
  const openConfirmationBox = (id) => {
    setConfirmBox(true);
    setProjectId(id);
  };
  const fetchPrjectsAmenity = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-amenity/all`
    );
    if (response) {
      const res = response.data;
      const list = res.map((item, index) => ({
        ...item,
        id: index + 1,
      }));      
      setProjectAmenityList(list);
    }
  };
  const openEditPopUp = async (item) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-amenity/${item.projectId}`
    );
    setShowModal(true);
    setTitle("Update Project Amenity");
    setButtonName("Update");
    setSelectedValue(response.data);
    setProjectId(item.projectId);
  };
  useEffect(() => {
    fetchProjects();
    fetchAmenities();
    fetchPrjectsAmenity();
  }, []);

  //Defining table columns
  const columns = [
    { field: "id", headerName: "S.no", width: 100 },
    { field: "projectName", headerName: "Project Name", width: 250 },
    { field: "amenities", headerName: "Amenities", width: 600 },
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
    <>
      <div className="d-flex justify-content-between mt-3">
        <h1 className="text-center">Manage Project&apos;s Amenity</h1>
        <Button className="mx-3" onClick={openAddModel}>
          + Add new city
        </Button>
      </div>
      <div className="table-container mt-5">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={projectAmenityList}
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
            <Form.Group className="mt-3">
              <Form.Label>Select Amenities</Form.Label>
              <Multiselect
                options={amenityList} // Options to display in the dropdown
                selectedValues={selectedValue} // Preselected value to persist in dropdown
                onSelect={onSelect} // Function will trigger on select event
                onRemove={onRemove} // Function will trigger on remove event
                displayValue="title" // Property name to display in the dropdown options
              />
            </Form.Group>
            <Button className="mt-3" variant="primary" type="submit">
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
          <Button variant="danger" onClick={deleteProjectAmenity}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}
