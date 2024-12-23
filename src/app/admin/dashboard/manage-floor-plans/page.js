"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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
  var [count, setCount] = useState(1);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setButtonName("Add Floor Plan");
    setShow(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      projectId: projectId,
      planType: planType,
      areaSqft: area,
    };
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}floor-plans/add-update`, data
      );
      if (response.data.isSuccess == 1) {
        toast.success(response.data.message);
        fetchAllFloorPlans();
        setShow(false);
      }
    } catch (error) {
      console.log("Error Occured", error);
      toast.error("Error Occured");
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
      setFloorPlanList(floorPlans.data);
    }
  };
  useEffect(() => {
    fetchProjects();
    fetchAllFloorPlans();
  },[]);
  return (
    <div>
      <div className="mt-3 d-flex justify-content-between">
        <p className="h1">Manage Floor Plans</p>
        <Button className="btn btn-success mb-2" onClick={handleShow}>
          + Add Floor Plan
        </Button>
      </div>
      <Table className="mt-5" striped bordered hover>
        <thead>
          <tr>
            <th>S No</th>
            <th>Project Name</th>
            <th>Plan Type</th>
            <th>Area(sqft)</th>
            <th>Area(sqmt)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            floorPlanList.map((item)=>(
              <tr key={count}>
                <td>{count++}</td>
                <td>{item.pname}</td>
                <td>{item.type}</td>
                <td>{item.areaSq}</td>
                <td>{item.areaMt}</td>
              </tr>              
            ))
          }
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group md="4" controlId="validationCustom01">
              <Form.Label>Select Project</Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setProjectId(e.target.value)}
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
            <Form.Group md="4" controlId="validationCustom01">
              <Form.Label>Plan Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Plan name"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group md="4" controlId="validationCustom01">
              <Form.Label>Enter Area</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />
            </Form.Group>
            <Button className="mt-3" variant="primary" type="submit">
              {buttonName}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}
