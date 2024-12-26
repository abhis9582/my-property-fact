"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function AddProject() {
  const [validated, setValidated] = useState(false);
  const [builderList, setBuilderList] = useState([]);
  const [projectTypeList, setProjectTypeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [projectList, setProjectList] = useState([]);
  // Defining the initial state
  const initialFormData = {
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    projectName: "",
    projectAddress: "",
    state: "",
    cityLocation: "",
    projectLocality: "",
    projectConfiguration: "",
    projectBy: "",
    projectPrice: "",
    ivrNo: "",
    reraQr: "",
    reraNo: "",
    reraWebsite: "",
    projectStatus: "",
    projectLogo: null,
    projectThumbnail: null,
    locationMap: null,
    propertyType: "",
    slugURL: "",
    showFeaturedProperties: true,
    status: true,
  };
  const [formData, setFormData] = useState(initialFormData);
  const fetchBuilders = async () => {
    const builders = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "builders/get-all"
    );
    if (builders) {
      setBuilderList(builders.data.builders);
    }
  };
  const fetchProjectTypes = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
    );
    setProjectTypeList(response.data);
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
  };
  useEffect(() => {
    fetchBuilders();
    fetchProjectTypes();
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (form.checkValidity() === true) {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      try {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + "projects/add-new",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.isSuccess === 1) {
          toast.success(response.data.message);
          setFormData(initialFormData);
        }
      } catch (error) {
        toast.error("Error saving Project");
      }
    }
  };
  return (
    <>
      <Button onClick={()=>openAddModel()}>Edit Project</Button>
      <div className="conatiner">
        <h1>Add new project</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Meta Title</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Meta Title"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Meta Title is required.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom02">
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Meta Description"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Meta Description is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="4"
              controlId="validationCustom03"
              className="position-relative mb-3"
            >
              <Form.Label>Meta Keyword</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Meta Keyword"
                name="metaKeyword"
                value={formData.metaKeyword}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Meta Keyword is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group
              as={Col}
              md="4"
              controlId="validationCustom04"
              className="position-relative mb-3"
            >
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                required
                name="projectName"
                placeholder="Project Name"
                value={formData.projectName}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Project Name is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom05">
              <Form.Label>Project Address</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Project Address"
                name="projectAddress"
                value={formData.projectAddress}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Project Address is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="4"
              controlId="validationCustom06"
              className="position-relative mb-3"
            >
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                required
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                State is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom07">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                name="cityLocation"
                value={formData.cityLocation}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                City is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom08">
              <Form.Label>Project Locality</Form.Label>
              <Form.Control
                type="text"
                placeholder="Project Locality"
                name="projectLocality"
                value={formData.projectLocality}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Project Locality is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom09">
              <Form.Label>Project Configuration</Form.Label>
              <Form.Control
                type="text"
                placeholder="Project Configuration"
                name="projectConfiguration"
                value={formData.projectConfiguration}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Project Configuration is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="4" controlId="validationCustom10">
              <Form.Label>Project By</Form.Label>
              <Form.Select
                aria-label="Default select example"
                name="projectBy"
                onChange={handleChange}
              >
                <option>Select Builder</option>
                {builderList.map((item) => (
                  <option
                    className="text-uppercase"
                    key={item.id}
                    value={item.id}
                  >
                    {item.builderName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Project By is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom11">
              <Form.Label>Project Price</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Project Price"
                name="projectPrice"
                value={formData.projectPrice}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Project price is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom12">
              <Form.Label>IVR Number</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="IVR number"
                name="ivrNo"
                value={formData.ivrNo}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                IVR Number is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom13">
              <Form.Label>Location Map</Form.Label>
              <Form.Control
                type="file"
                required
                name="locationMap"
                onChange={handleFileChange}
              />
              <Form.Control.Feedback type="invalid">
                Location map is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom14">
              <Form.Label>Reara Number</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Reara Number"
                name="reraNo"
                value={formData.reraNo}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Reara Number is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom15">
              <Form.Label>Reara Website</Form.Label>
              <Form.Control
                type="text"
                placeholder="Reara Website"
                name="reraWebsite"
                value={formData.reraWebsite}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="4" controlId="validationCustom16">
              <Form.Label>Project Logo</Form.Label>
              <Form.Control
                required
                type="file"
                placeholder="Project Logo"
                name="projectLogo"
                onChange={handleFileChange}
              />
              <Form.Control.Feedback type="invalid">
                Project logo is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom17">
              <Form.Label>Project Thumbnail</Form.Label>
              <Form.Control
                required
                type="file"
                placeholder="Project Thumnnail"
                name="projectThumbnail"
                onChange={handleFileChange}
              />
              <Form.Control.Feedback type="invalid">
                Project thumbnail is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom18">
              <Form.Label>Project Type</Form.Label>
              <Form.Select
                aria-label="Default select example"
                name="propertyType"
                onChange={handleChange}
              >
                <option>Select Type</option>
                {projectTypeList.map((item) => (
                  <option
                    className="text-uppercase"
                    key={item.id}
                    value={item.id}
                  >
                    {item.projectTypeName}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="4" controlId="validationCustom19">
              <Form.Label>Slug Url</Form.Label>
              <Form.Control
                type="text"
                placeholder="Slug Url"
                name="slugURL"
                value={formData.slugURL}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>
          <Button className="mt-3" type="submit">
            Post property
          </Button>
        </Form>
      </div>
      {/* Modal for adding a new city */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Meta Title</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Meta Title"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Meta Title is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label>Meta Description</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Meta Description"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Meta Description is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="4"
                controlId="validationCustom03"
                className="position-relative mb-3"
              >
                <Form.Label>Meta Keyword</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Meta Keyword"
                  name="metaKeyword"
                  value={formData.metaKeyword}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Meta Keyword is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                md="4"
                controlId="validationCustom04"
                className="position-relative mb-3"
              >
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  name="projectName"
                  placeholder="Project Name"
                  value={formData.projectName}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Project Name is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom05">
                <Form.Label>Project Address</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Project Address"
                  name="projectAddress"
                  value={formData.projectAddress}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Project Address is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="4"
                controlId="validationCustom06"
                className="position-relative mb-3"
              >
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  required
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  State is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom07">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  name="cityLocation"
                  value={formData.cityLocation}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  City is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustom08">
                <Form.Label>Project Locality</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Project Locality"
                  name="projectLocality"
                  value={formData.projectLocality}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Project Locality is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustom09">
                <Form.Label>Project Configuration</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Project Configuration"
                  name="projectConfiguration"
                  value={formData.projectConfiguration}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Project Configuration is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md="4" controlId="validationCustom10">
                <Form.Label>Project By</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="projectBy"
                  onChange={handleChange}
                >
                  <option>Select Builder</option>
                  {builderList.map((item) => (
                    <option
                      className="text-uppercase"
                      key={item.id}
                      value={item.id}
                    >
                      {item.builderName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Project By is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom11">
                <Form.Label>Project Price</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Project Price"
                  name="projectPrice"
                  value={formData.projectPrice}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Project price is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom12">
                <Form.Label>IVR Number</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="IVR number"
                  name="ivrNo"
                  value={formData.ivrNo}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  IVR Number is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom13">
                <Form.Label>Location Map</Form.Label>
                <Form.Control
                  type="file"
                  required
                  name="locationMap"
                  onChange={handleFileChange}
                />
                <Form.Control.Feedback type="invalid">
                  Location map is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom14">
                <Form.Label>Reara Number</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Reara Number"
                  name="reraNo"
                  value={formData.reraNo}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Reara Number is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom15">
                <Form.Label>Reara Website</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Reara Website"
                  name="reraWebsite"
                  value={formData.reraWebsite}
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md="4" controlId="validationCustom16">
                <Form.Label>Project Logo</Form.Label>
                <Form.Control
                  required
                  type="file"
                  placeholder="Project Logo"
                  name="projectLogo"
                  onChange={handleFileChange}
                />
                <Form.Control.Feedback type="invalid">
                  Project logo is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom17">
                <Form.Label>Project Thumbnail</Form.Label>
                <Form.Control
                  required
                  type="file"
                  placeholder="Project Thumnnail"
                  name="projectThumbnail"
                  onChange={handleFileChange}
                />
                <Form.Control.Feedback type="invalid">
                  Project thumbnail is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom18">
                <Form.Label>Project Type</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="propertyType"
                  onChange={handleChange}
                >
                  <option>Select Type</option>
                  {projectTypeList.map((item) => (
                    <option
                      className="text-uppercase"
                      key={item.id}
                      value={item.id}
                    >
                      {item.projectTypeName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md="4" controlId="validationCustom19">
                <Form.Label>Slug Url</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Slug Url"
                  name="slugURL"
                  value={formData.slugURL}
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
            <Button className="mt-3" type="submit">
              Post property
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
}
