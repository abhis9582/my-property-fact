"use client";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  var [count, setCount] = useState(1);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const handleClose = () => setShow(false);
  const [faqList, setFaqList] = useState([]);
  const [faqId, setFaqId] = useState(0);
  const handleShow = () => {
    setButtonName("Add Floor Plan");
    setShow(true);
    setProjectId(0);
    setAnswer("");
    setQuestion("");
  };
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
    const data ={
        faqQuestion: question,
        faqAnswer: answer,
        projectId: projectId
    }
    if(faqId > 0){
      data.id = faqId;
    }
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}project-faqs/add-update`, data);
        if(response.data.isSuccess === 1){
            toast.success(response.data.message);
            fetchFaqs();
            setShow(false);
        }
    }catch(error){
        toast.error("Error Occured");
        console.log(error);
        
    }
  };
  const openAddModel = () =>{
    setShow(true)
    setTitle("Add New FAQ");
    setButtonName("Add");
    setAnswer("")
    setQuestion("");
    setProjectId(0);
    setFaqId(0);
  }
  const openEditModel = (item) =>{
    setShow(true)
    setTitle("Update FAQ");
    setButtonName("Update");
    setAnswer(item.answer)
    setQuestion(item.question);
    setProjectId(item.projectId);
    setFaqId(item.id);
  }
  const fetchFaqs = async () =>{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}project-faqs/get-all`);
    if(response){
        setFaqList(response.data);
    }
  }
  useEffect(() => {
    fetchProjects();
    fetchFaqs();
  }, []);
  return (
    <>
      <div className="d-flex mt-3 justify-content-between">
        <p className="h1">Manage FAQs</p>
        <Button onClick={openAddModel}>+ Add FAQ</Button>
      </div>
      <Table className="mt-5" striped bordered hover>
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
      </Table>
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
                onChange={(e)=>setQuestion(e.target.value)}
              />
            </Form.Group>
            <Form.Group md="4" controlId="validationCustom01">
              <Form.Label>Enter Answer</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaDescription"
                value={answer}
                onChange={(e)=>setAnswer(e.target.value)}
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
