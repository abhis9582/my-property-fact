"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import CommonModal from "../common-model/common-model";
export default function LocationBenefit() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [bName, setBname] = useState("");
  const [distance, setDistance] = useState("");
  const [icon, setIcon] = useState("");
  const [benefitList, setBenefitsList] = useState([]);
  const [confirmBox, setConfirmBox] = useState(false);
  const [id, setId] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (form.checkValidity() === true) {
      try {
        const formData = new FormData();
        formData.append("iconImage", icon);
        formData.append("benefitName", bName);
        formData.append("distance", distance);
        formData.append("projectId", projectId);
        if (id > 0) {
          formData.append("id", id);
        }
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}location-benefit/add-new`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.isSuccess == 1) {
          setShowModal(false);
          toast.success(response.data.message);
          fetchAllBenefits();
        }
      } catch (error) {
        toast.error("Error occured");
      } finally {
        setShowLoading(false);
        setButtonName("Add");
      }
    }
  };
  const handleFileChange = (e) => {
    setIcon(e.target.files[0]);
  };
  const fetchProjects = async () => {
    const projectResponse = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "projects/get-all"
    );
    if (projectResponse) {
      setProjectList(projectResponse.data);
    }
  };
  const openAddModel = () => {
    setShowModal(true);
    setDistance("");
    setBname("");
    setIcon(null);
    setPreviewImage(null);
    setProjectId(0);
    setTitle("Add New Location Benefit");
    setButtonName("Add");
    setValidated(false);
  };
  const openEditModel = (item) => {
    setShowModal(true);
    setDistance(item.distance);
    setBname(item.benefitName);
    setIcon(null);
    setProjectId(item.projectId);
    setId(item.id);
    setPreviewImage(`/icon/${item.image}`);
    setTitle("Edit Location Benefit");
    setButtonName("Updte");
  };

  const openConfirmationBox = (id) => {
    setConfirmBox(true);
    setId(id);
  };
  const fetchAllBenefits = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}location-benefit/get-all`
    );
    const res = response.data;
    const list = res.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
    setBenefitsList(list);
  };
  useEffect(() => {
    fetchProjects();
    fetchAllBenefits();
  }, []);

  //Defining table columns
  const columns = [
    { field: "index", headerName: "S.no", width: 100 },
    { field: "projectName", headerName: "Project Name", width: 180 },
    {
      field: "image",
      headerName: "Benefit Image",
      width: 250,
      renderCell: (params) => (
        <Image
          src={`/icon/${params.row.image}`}
          alt="Project"
          width={50}
          height={50}
        />
      ),
    },
    {
      field: "benefitName",
      headerName: "Benefit Name",
      width: 239,
    },
    {
      field: "distance",
      headerName: "Distance",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      width: 270,
      renderCell: (params) => (
        <div>
          <FontAwesomeIcon
            className="mx-3 text-danger"
            style={{ cursor: "pointer" }}
            icon={faTrash}
            onClick={() => openConfirmationBox(params.row.id)}
          />
          {/* <FontAwesomeIcon
            className="text-warning"
            style={{ cursor: "pointer" }}
            icon={faPencil}
            onClick={() => openEditModel(params.row)}
          /> */}
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <>
      <div className="d-flex justify-content-between mt-3">
        <p className="h1">Manage Location Benefits</p>
        <Button className="btn btn-success" onClick={openAddModel}>+ Add New</Button>
      </div>
      <div className="table-container mt-5">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={benefitList}
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {previewImage && (
              <Image src={previewImage} alt="image" width={50} />
            )}
            <Form.Group controlId="selectIcon" className="mb-3">
              <Form.Label>Select icon</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group controlId="selectPorject">
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
            <Form.Group className="mb-3" controlId="benefitName">
              <Form.Label>Benefit Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Benefit name"
                value={bName}
                onChange={(e) => setBname(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Benefit name is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="distance">
              <Form.Label>Distance(in KM)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Distance is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Button className="btn btn-success" type="submit" disabled={showLoading}>
              {buttonName} <LoadingSpinner show={showLoading} />
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <CommonModal confirmBox={confirmBox} setConfirmBox={setConfirmBox} api={`${process.env.NEXT_PUBLIC_API_URL}location-benefit/delete/${id}`} fetchAllHeadersList={fetchAllBenefits} />
    </>
  );
}
