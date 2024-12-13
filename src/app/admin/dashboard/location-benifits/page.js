"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function LocationBenefit() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [bName, setBname] = useState("");
  const [distance, setDistance] = useState("");
  const [icon, setIcon] = useState("");
  const [benefitList, setBenefitsList] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("iconImage", icon);
      formData.append("benefitName", bName);
      formData.append("distance", distance);
      formData.append("projectId", projectId);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}location-benefit/add-new`, formData,{
        headers:{
            "Content-Type": "multipart/form-data",
        }
      });
      if(response.data.isSuccess == 1){
        setShowModal(false);
        toast.success(response.data.message);
        fetchAllBenefits();
      }
    } catch (error) {
      toast.error("Error occured");
    }
  };
  const handleFileChange = (e) => {
    setIcon(e.target.files[0]);
  };
  const fetchProjects = async () => {
    const projectResponse = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "properties/get-all"
    );
    if (projectResponse) {
      setProjectList(projectResponse.data);
    }
  };
  const openAddModel = () => {
    setShowModal(true);
    setTitle("Add New Location Benefit");
    setButtonName("Add");
  };
  const fetchAllBenefits = async ()=>{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}location-benefit/get-all`);
    setBenefitsList(response.data);
  }
  useEffect(() => {
    fetchProjects();
    fetchAllBenefits();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between mt-3">
        <p className="h1">Manage Location Benefits</p>
        <Button onClick={openAddModel}>+ Add New</Button>
      </div>
      <Table className="mt-5" striped bordered hover>
        <thead>
          <tr>
            <th>S No</th>
            <th>Project Name</th>
            <th>Icon</th>
            <th>Name</th>
            <th>Distance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {benefitList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.projectName}</td>
                <td>
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}icon/${item.image}`}
                    alt="image"
                    width={"50"}
                  />
                </td>
                <td>{item.benefitName}</td>
                <td>{item.distance}</td>
                <td>@mdo</td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select icon</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
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
            <Form.Group className="mb-3" controlId="formCityName">
              <Form.Label>Benefit Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Benefit name"
                value={bName}
                onChange={(e) => setBname(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                State is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCityName">
              <Form.Label>Distance(in KM)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Benefit name"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                State is required
              </Form.Control.Feedback>
            </Form.Group>
            <Button className="mt-3" variant="primary" type="submit">
              {buttonName}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
}
