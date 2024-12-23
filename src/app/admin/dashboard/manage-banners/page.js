"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, FormControl, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ManageBanners() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const [altTag, setAltTag] = useState("");
  const [projectId, setProjectId] = useState("");
  const [desktopBanner, setdesktopBanner] = useState(null);
  const [mobileBanner, setMobileBanner] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [inputTitle, setInputTitle] = useState("");
  const [bannerType, setBannerType] = useState("");
  const [bannerList, setBannerList] = useState([]);
  const [mobileBannerList, setMobileBannerList] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desktopBanner) {
      alert("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("desktopBanner", desktopBanner);
    formData.append("mobileBanner", desktopBanner);
    formData.append("projectId", projectId);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}project-banner/add-banner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("File uploaded successfully.");
        setShowModal(false);
      } else {
        toast.error("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file.");
    }
  };
  const openAddMobileBanner = () => {
    setShowModal(true);
    setTitle("Add Mobile Banner");
    setInputTitle("Select Mobile Banner");
    setButtonName("Add");
  };
  const openAddHomepageBanner = () => {
    setShowModal(true);
    setTitle("Add Homepage Banner");
    setInputTitle("Select Hopage Banner");
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
  const fetchBannerImages = async () => {
    const projectResponse = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "project-banner/get-all"
    );
    if (projectResponse) {
      setBannerList(projectResponse.data);
    }
  };
  const fetchMobileBanners = async () => {
    const projectResponse = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "project-banner/get-mobile-banners"
    );
    if (projectResponse) {
      setMobileBannerList(projectResponse.data);
    }
  };
  useEffect(() => {
    fetchProjects();
    fetchBannerImages();
    fetchMobileBanners();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setMobileBanner(selectedFile);
  };
  const handleDesktopBannerChange = (e) =>{
    const selectedFile = e.target.files[0];
    setdesktopBanner(selectedFile);
  }
  return (
    <div>
      <p className="h1 mt-3">Manage All Banners</p>
      <div className="conatiner border rounded-3 p-3 mt-4">
        <div className="d-flex justify-content-between">
          <p>Manage Project Mobile Banners</p>
          <Button className="mb-2" onClick={openAddMobileBanner}>
            + Add Project Banner
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>S No</th>
              <th>Mobile Banner Image</th>
              <th>Desktop Banner</th>
              <th>Project Name</th>
              <th>Alt tag</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mobileBannerList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${item.slugURL}/${item.projectThumbnail}`}
                    alt="image"
                    width={"200"}
                  />
                </td>
                <td></td>
                <td>{item.projectName}</td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="conatiner border rounded-3 p-3 mt-4">
        <div className="d-flex justify-content-between">
          <p>Manage HomePage Banner</p>
          <Button className="mb-2" onClick={openAddHomepageBanner}>
            + Add Home Banner
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>S no</th>
              <th>Home Banner</th>
              <th>Alt tag</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="formFile1" className="mb-3">
              <Form.Label>{inputTitle}</Form.Label>
              <Form.Control type="file" onChange={(e) => handleFileChange(e)} />
            </Form.Group>
            <Form.Group controlId="formFile2" className="mb-3">
              <Form.Label>Select Desktop banner</Form.Label>
              <Form.Control type="file" onChange={(e) => handleDesktopBannerChange(e)} />
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
            <Form.Group md="4" controlId="validationCustom01">
              <Form.Label>Alt Tag</Form.Label>
              <FormControl placeholder="Alt Tag" type="text" value={altTag} onChange={(e)=>setAltTag(e.target.value)}/>
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
