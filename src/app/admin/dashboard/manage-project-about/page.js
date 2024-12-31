"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Form, Modal, Table } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function ManageProjectAbout() {
  const editor = useRef(null);
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [validated, setValidated] = useState(false);
  const [aboutList, setAboutList] = useState([]);
  const [aboutId, setAboutId] = useState(0);
  const [confirmBox, setConfirmBox] = useState(false);
  // Helper function to remove HTML tags and truncate the text
  const removeHtmlTagsAndTruncate = (text, limit = 200) => {
    // Remove HTML tags using a regex
    const textWithoutHtml = text.replace(/<[^>]+>/g, "");

    // Truncate the text to the specified limit and add '...' if it's too long
    return textWithoutHtml.length > limit
      ? textWithoutHtml.slice(0, limit) + "..."
      : textWithoutHtml;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      shortDesc: shortDesc,
      longDesc: longDesc,
      projectId: projectId,
    };
    if (aboutId > 0) {
      data.id = aboutId;
    }
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}project-about/add-update`,
      data
    );
    if (response.data.isSuccess === 1) {
      toast.success(response.data.message);
      setShowModal(false);
      fetchProjectsAbout();
    } else {
      toast.error(response.data.message);
    }
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
    setTitle("Add Project About");
    setProjectId(0);
    setShortDesc("");
    setLongDesc("");
    setAboutId(0);
  };
  const openEditModel = (item) => {
    setShowModal(true);
    setTitle("Edit Project About");
    setProjectId(item.projectId);
    setShortDesc(item.shortDesc);
    setLongDesc(item.longDesc);
    setAboutId(item.id);
  };
  const fetchProjectsAbout = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-about/get`
    );
    if (response) {
      setAboutList(response.data);
    } else {
      setAboutList([]);
    }
  };
  const openConfirmationBox = (id) => {
    setAboutId(id);
    setConfirmBox(true);
  };
  const deletePrjectAbout = async () => {
    if (aboutId > 0) {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}project-about/delete/${aboutId}`
      );
      if (response.data.isSuccess === 1) {
        toast.success(response.data.message);
        fetchProjectsAbout();
        setConfirmBox(false);
      } else {
        toast.error("Something went wrong...");
      }
    }
  };
  useEffect(() => {
    fetchProjects();
    fetchProjectsAbout();
  }, []);
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mt-3">
        <p className="h1 ">Manage Project About</p>
        <Button className="mx-3 m-0" onClick={openAddModel}>
          +Add
        </Button>
      </div>
      <Table className="mt-5" striped bordered hover responsive>
        <thead style={{ display: "table", width: "100%" }}>
          <tr className="text-center">
            <th className="sno">S no</th>
            <th className="project-name-col">Project Name</th>
            <th className="short-dec-col">Short description</th>
            <th className="short-dec-col">Long Description</th>
            <th className="action-col">Action</th>
          </tr>
        </thead>
        <tbody className="table-scroll">
          {aboutList.map((item, index) => (
            <tr key={`row-${index}`} className="text-center">
              <td className="sno">{index + 1}</td>
              <td className="project-name-col">{item.projectName}</td>
              <td className="short-dec-col">
                {removeHtmlTagsAndTruncate(item.shortDesc, 200)}
              </td>
              <td className="short-dec-col">
                {removeHtmlTagsAndTruncate(item.longDesc, 200)}
              </td>
              <td className="action-col">
                <div className="d-flex justify-content-center">
                  <FontAwesomeIcon
                    className="cursor-pointer text-warning mx-2"
                    icon={faPencil}
                    onClick={() => openEditModel(item)}
                  />
                  <FontAwesomeIcon
                    className="cursor-pointer text-danger mx-2"
                    icon={faTrash}
                    onClick={() => openConfirmationBox(item.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Modal for adding a new city */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSubmit}>
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
            <Form.Group className="mb-3" controlId="formCityName">
              <Form.Label>Write short description</Form.Label>
              <JoditEditor
                ref={editor}
                value={shortDesc}
                onChange={(newcontent) => setShortDesc(newcontent)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCityName">
              <Form.Label>Write long description</Form.Label>
              <JoditEditor
                ref={editor}
                value={longDesc}
                onChange={(newcontent) => setLongDesc(newcontent)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          {/* <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formCityName">
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city name"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                City is required
              </Form.Control.Feedback>
            </Form.Group>
          </Form> */}
        </Modal.Body>
      </Modal>
      <Modal show={confirmBox} onHide={() => setConfirmBox(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete ?</Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body> */}
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={() => setConfirmBox(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={deletePrjectAbout}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}
