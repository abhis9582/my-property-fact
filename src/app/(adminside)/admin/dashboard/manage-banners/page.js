"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Col, Form, FormControl, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonModal from "../common-model/common-model";
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
  const [bannerList, setBannerList] = useState([]);
  const [bannerId, setBannerId] = useState(0);
  const [previewMobileBanner, setPreviewMobileBanner] = useState("");
  const [previewDesktopBanner, setPreviewDesktopBanner] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (form.checkValidity() === true) {
      setShowLoading(true);
      setButtonName("");
      if (desktopBanner != null) formData.append("desktopBanner", desktopBanner);
      if (mobileBanner != null) formData.append("mobileBanner", mobileBanner);
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
        if (response.data.isSuccess === 1) {
          toast.success(response.data.message);
          setShowModal(false);
          fetchBannerImages();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file.");
      }finally{
        setShowLoading(false);
        setButtonName("Add");
      }
    }
  };
  const openAddMobileBanner = () => {
    setValidated(false);
    setShowModal(true);
    setTitle("Add Banner");
    setInputTitle("Select Mobile Banner");
    setAltTag("");
    setProjectId(0);
    setdesktopBanner("");
    setMobileBanner("");
    setButtonName("Add");
    setPreviewDesktopBanner(null);
    setPreviewMobileBanner(null);
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
    setdesktopBanner(null);
    setMobileBanner(null);
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
      const res = projectResponse.data;
      const list = res.map((item, index) => ({
        ...item,
        index: index + 1,
      }));
      setBannerList(list);
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

  //Handling deletion of banner
  const openConfirmationBox = (id) =>{
    setConfirmBox(true);
    setBannerId(id);
  }
  //Defining table columns
  const columns = [
    { field: "index", headerName: "S.no", width: 100 },
    {
      field: "mobileBanner",
      headerName: "Mobile Banner",
      width: 250,
      renderCell: (params) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${params.row.slugURL}/${params.row.mobileBanner}`}
          alt="Project"
          width={50}
          height={50}
          style={{ borderRadius: '5px' }}
          objectFit="cover"
          unoptimized
        />
      ),
    },
    {
      field: "deskktopBanner",
      headerName: "Mobile Banner",
      width: 250,
      renderCell: (params) => (
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${params.row.slugURL}/${params.row.desktopBanner}`}
          alt="Project"
          width={150}
          height={50}
          unoptimized
          style={{ borderRadius: '5px' }}
        />
      ),
    },
    { field: "projectName", headerName: "Project Name", width: 200 },
    { field: "altTag", headerName: "Alt Tag", width: 200 },
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
            onClick={() => openEditModel(params.row)}
          />
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div>
      <div className="conatiner">
        <div className="mt-3 d-flex justify-content-between">
          <p className="h1">Manage Project Banners</p>
          <Button className="mb-2 btn btn-success" onClick={openAddMobileBanner}>
            + Add Project Banner
          </Button>
        </div>
        <div className="table-container mt-5">
          <Paper sx={{ height: 550, width: "100%" }}>
            <DataGrid
              rows={bannerList}
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
                <Image
                  src={previewMobileBanner}
                  alt="Mobile Banner Preview"
                  width={100}
                  height={100}
                />
              </div>
            )}
            <Form.Group controlId="projectMobileBanner" className="mb-3">
              <Form.Label>{inputTitle}</Form.Label>
              <Form.Control type="file" onChange={(e) => handleFileChange(e)} />
              <Form.Control.Feedback type="invalid">
                Project mobile banner is required !
              </Form.Control.Feedback>
            </Form.Group>
            {/* Image Preview for Desktop Banner */}
            {previewDesktopBanner && (
              <div className="image-preview mb-3">
                <Image
                  src={previewDesktopBanner}
                  alt="Desktop Banner Preview"
                  width={200}
                  height={100}
                />
              </div>
            )}
            <Form.Group controlId="projectDesktopBanner" className="mb-3">
              <Form.Label>Select Desktop banner</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleDesktopBannerChange(e)}
              />
              <Form.Control.Feedback type="invalid">
                Project desktop banner is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group md="4" controlId="selectProjectForBanner">
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
            <Form.Group md="4" controlId="projectBannerAltTag">
              <Form.Label>Alt Tag</Form.Label>
              <FormControl
                placeholder="Alt Tag"
                type="text"
                value={altTag || ""}
                onChange={(e) => setAltTag(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Alt tag is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Button className="mt-3 btn btn-success" type="submit" disabled={showLoading}>
              {buttonName} <LoadingSpinner show={showLoading} />
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
      <CommonModal confirmBox={confirmBox} setConfirmBox={setConfirmBox} api={`${process.env.NEXT_PUBLIC_API_URL}project-banner/delete/${bannerId}`} fetchAllHeadersList={fetchBannerImages}/>
    </div>
  );
}
