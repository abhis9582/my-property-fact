"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const [bannerId, setBannerId] = useState(0);
  const [previewMobileBanner, setPreviewMobileBanner] = useState("");
  const [previewDesktopBanner, setPreviewDesktopBanner] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!desktopBanner) {
    //   alert("Please select a file first.");
    //   return;
    // }
    const formData = new FormData();
    if(desktopBanner != null)
    formData.append("desktopBanner", desktopBanner);
    if(mobileBanner != null)
    formData.append("mobileBanner", mobileBanner);
    formData.append("projectId", projectId);
    formData.append("altTag", altTag);
    formData.append("id", bannerId);
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
    setTitle("Add Banner");
    setInputTitle("Select Mobile Banner");
    setAltTag("");
    setProjectId(0);
    setdesktopBanner("");
    setMobileBanner("");
    setButtonName("Add");
  };
  const openAddHomepageBanner = () => {
    setShowModal(true);
    setTitle("Add Homepage Banner");
    setInputTitle("Select Hopage Banner");
    setButtonName("Add");
  };
  const openEditModel = (item) => {
    const desktopBannerImage = `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${item.slugURL}/${item.desktopBanner}`;
    const mobileBannerImage = `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${item.slugURL}/${item.mobileBanner}`;
    setShowModal(true);
    setTitle("Edit Banner");
    setInputTitle("Select Mobile Banner");
    setAltTag(item.altTag);
    setProjectId(item.projectId);
    setPreviewDesktopBanner(desktopBannerImage);
    setPreviewMobileBanner(mobileBannerImage);
    setBannerId(item.id);
    setButtonName("Update");
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
  useEffect(() => {
    fetchProjects();
    fetchBannerImages();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setMobileBanner(selectedFile);
  };
  const handleDesktopBannerChange = (e) => {
    const selectedFile = e.target.files[0];
    setdesktopBanner(selectedFile);
  };
  return (
    <div>
      <p className="h1 mt-3">Manage All Banners</p>
      <div className="conatiner border rounded-3 p-3 mt-4">
        <div className="d-flex justify-content-between">
          <p>Manage Project Banners</p>
          <Button className="mb-2" onClick={openAddMobileBanner}>
            + Add Project Banner
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="text-center">S No</th>
              <th className="text-center">Mobile Banner</th>
              <th className="text-center">Desktop Banner</th>
              <th className="text-center">Project Name</th>
              <th className="text-center">Alt tag</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {bannerList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${item.slugURL}/${item.mobileBanner}`}
                    alt="image"
                    width={"200"}
                  />
                </td>
                <td>
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${item.slugURL}/${item.desktopBanner}`}
                    alt="image"
                    width={"200"}
                  />
                </td>
                <td>{item.projectName}</td>
                <td>{item.altTag}</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <FontAwesomeIcon
                      className="cursor-pointer"
                      icon={faPencil}
                      onClick={() => openEditModel(item)}
                    />
                    <FontAwesomeIcon
                      className="cursor-pointer mx-2 text-danger"
                      icon={faTrash}
                    />
                  </div>
                </td>
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
            {/* Image Preview for Mobile Banner */}
            {previewMobileBanner && (
              <div className="image-preview mb-3">
                <img
                  src={previewMobileBanner}
                  alt="Mobile Banner Preview"
                  style={{ maxWidth: "20%", height: "auto", justifySelf: "center", display: "flex" }}
                />
              </div>
            )}
            <Form.Group controlId="formFile1" className="mb-3">
              <Form.Label>{inputTitle}</Form.Label>
              <Form.Control type="file" onChange={(e) => handleFileChange(e)} />
            </Form.Group>
            {/* Image Preview for Desktop Banner */}
            {previewDesktopBanner && (
              <div className="image-preview mb-3">
                <img
                  src={previewDesktopBanner}
                  alt="Desktop Banner Preview"
                  style={{ maxWidth: "20%", height: "auto", justifySelf: "center", display: "flex" }}
                />
              </div>
            )}
            <Form.Group controlId="formFile2" className="mb-3">
              <Form.Label>Select Desktop banner</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleDesktopBannerChange(e)}
              />
            </Form.Group>
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
            <Form.Group md="4" controlId="validationCustom01">
              <Form.Label>Alt Tag</Form.Label>
              <FormControl
                placeholder="Alt Tag"
                type="text"
                value={altTag || ""}
                onChange={(e) => setAltTag(e.target.value)}
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
