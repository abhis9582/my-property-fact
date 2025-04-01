"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonModal from "../common-model/common-model";
export default function ManageFaqs() {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [validated, setValidated] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const handleClose = () => setShow(false);
  const [faqList, setFaqList] = useState([]);
  const [faqId, setFaqId] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
  const fetchProjects = async () => {
    const projectResponse = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "projects/get-all"
    );
    if (projectResponse) {
      setProjectList(projectResponse.data);
    }
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
      const data = {
        faqQuestion: question,
        faqAnswer: answer,
        projectId: projectId,
      };
      if (faqId > 0) {
        data.id = faqId;
      }
      try {
        setShowLoading(true);
        setButtonName("");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}project-faqs/add-update`,
          data
        );
        if (response.data.isSuccess === 1) {
          toast.success(response.data.message);
          fetchFaqs();
          setShow(false);
        }
      } catch (error) {
        toast.error("Error Occured");
        console.log(error);
      } finally {
        setShowLoading(false);
        setButtonName("Add FAQ");
      }
    }
  };
  //Handle Add FAQ
  const openAddModel = () => {
    setValidated(false);
    setShow(true);
    setTitle("Add FAQ");
    setButtonName("Add FAQ");
    setAnswer("");
    setQuestion("");
    setProjectId(0);
    setFaqId(0);
  };
  //Handle edit FAQ
  const openEditModel = (item) => {
    setShow(true);
    setTitle("Update FAQ");
    setButtonName("Update");
    setAnswer(item.answer);
    setQuestion(item.question);
    setProjectId(item.projectId);
    setFaqId(item.id);
  };
  //Fetch all faq list
  const fetchFaqs = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-faqs/get-all`
    );
    const res = response.data;
    const list = res.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
    setFaqList(list);
  };

  //Handle delete faq
  const openConfirmationBox = (id) => {
    setFaqId(id);
    setShowConfirmationBox(true);
  };

  useEffect(() => {
    fetchProjects();
    fetchFaqs();
  }, []);
  //Defining table columns
  const columns = [
    { field: "index", headerName: "S.no", width: 100 },
    { field: "projectName", headerName: "Project Name", width: 250 },
    { field: "question", headerName: "Question", width: 600 },
    { field: "answer", headerName: "Answer", width: 600 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="gap-3">
          <FontAwesomeIcon
            className="text-danger mx-2"
            style={{ cursor: "pointer" }}
            icon={faTrash}
            onClick={() => openConfirmationBox(params.row.id)}
          />
          <FontAwesomeIcon
            className="text-warning pointer mx-2"
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
    <>
      <div className="d-flex mt-3 justify-content-between">
        <p className="h1">Manage FAQs</p>
        <Button className="btn btn-success" onClick={openAddModel}>
          + Add FAQ
        </Button>
      </div>
      <div className="table-container mt-5">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={faqList}
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
            <Form.Group controlId="question">
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaDescription"
                placeholder="Enter Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Question is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group md="4" controlId="answer">
              <Form.Label>Answer</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaDescription"
                value={answer}
                placeholder="Enter Answer"
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Answer is required !
              </Form.Control.Feedback>
            </Form.Group>
            <Button className="mt-3 btn btn-success" type="submit" disabled={showLoading}>
              {buttonName} <LoadingSpinner show={showLoading} />
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
      <CommonModal
        confirmBox={showConfirmationBox}
        setConfirmBox={setShowConfirmationBox}
        api={`${process.env.NEXT_PUBLIC_API_URL}project-faqs/delete/${faqId}`}
        fetchAllHeadersList={fetchFaqs} />
    </>
  );
}
