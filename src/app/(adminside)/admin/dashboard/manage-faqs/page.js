"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Table, ToastContainer } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    const data = {
      faqQuestion: question,
      faqAnswer: answer,
      projectId: projectId,
    };
    if (faqId > 0) {
      data.id = faqId;
    }
    try {
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
    }
  };
  const openAddModel = () => {
    setShow(true);
    setTitle("Add New FAQ");
    setButtonName("Add");
    setAnswer("");
    setQuestion("");
    setProjectId(0);
    setFaqId(0);
  };
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
      id: index + 1,
    }));
    setFaqList(list);
  };

  //Handle delete faq
  const openConfirmationBox = (id) => {};

  useEffect(() => {
    fetchProjects();
    fetchFaqs();
  }, []);
  //Defining table columns
  const columns = [
    { field: "id", headerName: "S.no", width: 100 },
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
      {/* <Table className="mt-5" striped bordered hover>
        <thead>
          <tr>
            <th>S No</th>
            <th>Project Name</th>
            <th>Question</th>
            <th>Answer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {faqList.map((item, index) => (
            <tr key={`row-${index}`}>
              <td>{index + 1}</td>
              <td>{item.projectName}</td>
              <td>{item.question}</td>
              <td>{item.answer}</td>
              <td>
                <div className="d-flex mt-3">
                  <FontAwesomeIcon 
                  className="mx-2 text-warning cursor-pointer" 
                  icon={faPencil}
                  onClick={()=>openEditModel(item)}
                  />
                  <FontAwesomeIcon className="mx-2 text-danger cursor-pointer" icon={faTrash}/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> */}
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
              <Form.Label>Enter Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaDescription"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </Form.Group>
            <Form.Group md="4" controlId="validationCustom01">
              <Form.Label>Enter Answer</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaDescription"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
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
