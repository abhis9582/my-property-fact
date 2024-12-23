"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function ManageProjectAbout() {
  const editor = useRef(null);
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      shortDesc: shortDesc,
      longDesc: longDesc,
      projectId: projectId
    };
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}project-about/add-update`,
      data
    );
    if (response.data.isSuccess === 1) {
      toast.success(response.data.message);
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

  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div className="container-fluid">
      <h1>Manage Project About</h1>
      <div className="mt-5">
        <Form noValidate onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
}
