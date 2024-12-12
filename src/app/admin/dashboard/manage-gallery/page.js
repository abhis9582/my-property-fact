"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ManageGallery() {
  const [projectList, setProjectList] = useState([]);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [galleryImage, setGalleryImage] = useState("");
  const [galleryList, setGalleryList] = useState([]);
  const [show, setShow] = useState(false);
  var [count, setCount] = useState(1);
  const handleShow = () => {
    setShow(true);
    setButtonName("Add");
  };
  const fetchProjects = async () => {
    const projectResponse = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "properties/get-all"
    );
    if (projectResponse) {
      setProjectList(projectResponse.data);
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setGalleryImage(selectedFile);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("image", galleryImage);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}project-gallery/add-new`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        toast.success(response.data.message);
        fetchGalleryImage();
        setShow(false);
      }
    } catch (error) {
      console.log("Error Occured", error);
    }
  };
  const fetchGalleryImage = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}project-gallery/get-all`);
    if(response){
        setGalleryList(response.data);
    }
  };
  useEffect(() => {
    fetchProjects();
    fetchGalleryImage();
  }, []);
  return (
    <div className="container_fluid">
      <div className="mt-3 d-flex justify-content-between">
        <p className="h1">Manage Project&apos;s Gallery</p>
        <Button className="btn btn-success mb-2" onClick={handleShow}>
          + Add Gallery Image
        </Button>
      </div>
      <Table className="mt-5" striped bordered hover>
        <thead>
          <tr>
            <th>S No</th>
            <th>Project Name</th>
            <th>Gallery Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {galleryList.map((item) => (
            <tr key={count}>
              <td>{count++}</td>
              <td>{item.pname}</td>
              <td>
                <img src={`/properties/${item.pname}/${item.image}`} alt="image" style={{width: "100px"}}/>
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Gallery Image</Modal.Title>
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
            <Form.Group controlId="formFile" className="mb-3 mt-3">
              <Form.Label>Select Gallery Image</Form.Label>
              <Form.Control type="file" onChange={(e) => handleFileChange(e)} />
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
