"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function ManageProjectWalkthrough() {
  const editor = useRef(null);
  const [walkthroughDesc, setWalkthroughDesc] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      walkthroughDesc: walkthroughDesc,
      projectId: projectId,
    };
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}project-walkthrough/add-update`,
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
      <h1>Manage Project Walkthrough</h1>
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
          <Form.Group className="mb-3 mt-4" controlId="formCityName">
            <Form.Label>Walkthrough description</Form.Label>
            <JoditEditor
              ref={editor}
              value={walkthroughDesc}
              onChange={(newcontent) => setWalkthroughDesc(newcontent)}
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
