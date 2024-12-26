"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Multiselect from "multiselect-react-dropdown";
export default function ProjectsAmenity() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [validated, setValidated] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [amenityList, setAmenityList] = useState([]);
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
    } else {
      toast.error(response.data.message);
    }
  };
  useEffect(() => {
    fetchProjects();
    fetchAmenities();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between mt-3">
        <h1 className="text-center">Manage Project&apos;s Amenity</h1>
        <Button className="mx-3" onClick={openAddModel}>
          + Add new city
        </Button>
      </div>
      <Table className="mt-5" striped bordered hover variant="light">
        <thead>
          <tr>
            <th>S no</th>
            <th>Project Name</th>
            <th>Amenitys</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* {cityList.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.state}</td>
              <td>{item.metaTitle}</td>
              <td>{item.metaKeyWords}</td>
              <td>{item.metaDescription}</td>
              <td>
                <div>
                  <FontAwesomeIcon
                    className="mx-3 text-danger"
                    style={{ cursor: "pointer" }}
                    icon={faTrash}
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
          ))} */}
        </tbody>
      </Table>
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
      <ToastContainer />
    </>
  );
}
