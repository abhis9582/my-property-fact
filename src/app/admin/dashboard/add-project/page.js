"use client";

import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
export default function AddProject() {
  const [validated, setValidated] = useState(false);
  const [builderList, setBuilderList] = useState([]);
  const [projectTypeList, setProjectTypeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [title, setTitle] = useState("");
  const editor = useRef(null);
  const [amenityDesc, setAmenityDesc] = useState("");
  const [floorPlanDesc, setFloorPlanDesc] = useState("");
  const [locationDesc, setLocationDesc] = useState("");
  const [confirmBox, setConfirmBox] = useState(false);
  const [buttonName, setButtonName] = useState("");
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
    projectBy: 0,
    projectPrice: "",
    ivrNo: "",
    reraQr: "",
    reraNo: "",
    reraWebsite: "",
    projectStatus: "",
    projectLogo: null,
    projectThumbnail: null,
    locationMap: null,
    propertyType: 0,
    slugURL: "",
    showFeaturedProperties: true,
    status: true,
    amenityDesc: "",
    locationDesc: "",
    floorPlanDesc: "",
    country: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [projectDetailList, setProjectDetailList] = useState([]);
  const [locationPreview, setLocationPreview] = useState("");
  const [projectThumbnail, setProjectThumbnail] = useState("");
  const [projectLogoPreview, setProjectLogoPreview] = useState("");
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
    setTitle("Add New Project");
    setShowModal(true);
    setButtonName("Add Project");
    setFormData(initialFormData);
    setAmenityDesc("");
    setFloorPlanDesc("");
    setLocationDesc("");
  };
  const openEditModel = (item) => {
    setTitle("Edit Project");
    setShowModal(true);
    setButtonName("Update Project");
    setAmenityDesc(item.amenityDesc);
    setFloorPlanDesc(item.floorPlanDesc);
    setLocationDesc(item.locationDesc);
    setLocationPreview(
      `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${item.slugURL}/${item.locationMap}`
    );
    setProjectThumbnail(
      `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${item.slugURL}/${item.projectThumbnail}`
    );
    setProjectLogoPreview(
      `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${item.slugURL}/${item.projectLogo}`
    );
    // Dynamically update the form data with the values from the item
    setFormData({
      ...initialFormData, // You can retain the initial values if needed
      ...item, // Overwrite with item data
      locationMap: null,
      projectLogo: null,
      projectThumbnail: null
    });
  };
  const deleteProject = () => {
    console.log();
  };
  const openConfirmationBox = () => {
    setConfirmBox(true);
  };
  const fetchProjectsWithDetail = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}projects/get-all`
    );
    if (response) {
      setProjectDetailList(response.data);
    }
  };
  useEffect(() => {
    fetchBuilders();
    fetchProjectTypes();
    fetchProjects();
    fetchProjectsWithDetail();
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
    console.log(formData);
    
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
      <div className="d-flex justify-content-between mt-3">
        <p className="h1 ">Manage Projects</p>
        <Button className="mx-3" onClick={() => openAddModel()}>
          + Add new Project
        </Button>
      </div>
      <div>
        <Table className="table-container">
          <thead>
            <tr>
              <th>S no</th>
              <th>Project Name</th>
              <th>Builder Name</th>
              <th>Project Location</th>
              <th>Project Configuration</th>
              <th>Project Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projectDetailList.map((item, index) => (
              <tr key={`row-${index}`}>
                <td>{index + 1}</td>
                <td>{item.projectName}</td>
                <td>{item.projectBy}</td>
                <td>{item.projectLocality}</td>
                <td>{item.projectConfiguration}</td>
                <td>{item.propertyType}</td>
                <td>
                  <div>
                    <FontAwesomeIcon
                      className="mx-2 text-warning cursor-pointer"
                      icon={faPencil}
                      onClick={() => openEditModel(item)}
                    />
                    <FontAwesomeIcon
                      className="mx-2 text-danger cursor-pointer"
                      icon={faTrash}
                      onClick={openConfirmationBox}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {/* Modal for adding a new project */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom01">
                <Form.Label>Meta Title</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Meta Title"
                  name="metaTitle"
                  value={formData.metaTitle || ""}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Meta Title is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom02">
                <Form.Label>Meta Description</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Meta Description"
                  name="metaDescription"
                  value={formData.metaDescription || ""}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Meta Description is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                md="6"
                controlId="validationCustom03"
                className="position-relative mb-3"
              >
                <Form.Label>Meta Keyword</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Meta Keyword"
                  name="metaKeyword"
                  value={formData.metaKeyword || ""}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Meta Keyword is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="6"
                controlId="validationCustom04"
                className="position-relative mb-3"
              >
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  name="projectName"
                  placeholder="Project Name"
                  value={formData.projectName || ""}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Project Name is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md="6" controlId="validationCustom05">
                <Form.Label>Project Address</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Project Address"
                  name="projectAddress"
                  value={formData.projectAddress || ""}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Project Address is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="6"
                controlId="validationCustom06"
                className="position-relative mb-3"
              >
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  required
                  name="state"
                  placeholder="State"
                  value={formData.state || ""}
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
                  value={formData.cityLocation || ""}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  City is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom08">
                <Form.Label>Project Locality</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Project Locality"
                  name="projectLocality"
                  value={formData.projectLocality || ""}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Project Locality is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom09">
                <Form.Label>Project Configuration</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Project Configuration"
                  name="projectConfiguration"
                  value={formData.projectConfiguration || ""}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Project Configuration is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom10">
                <Form.Label>Project By</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="projectBy"
                  onChange={handleChange}
                  value={formData.projectBy || 0}
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
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom11">
                <Form.Label>Project Price</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Project Price"
                  name="projectPrice"
                  value={formData.projectPrice || ""}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Project price is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom12">
                <Form.Label>IVR Number</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="IVR number"
                  name="ivrNo"
                  value={formData.ivrNo || ""}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  IVR Number is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom13">
                <Form.Label>Location Map</Form.Label>
                {formData.locationMap && (
                  <div>
                    <img
                      src={locationPreview}
                      alt="Current Project locationmap"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <br />
                  </div>
                )}
                <Form.Control
                  type="file"
                  // required
                  name="locationMap"
                  onChange={handleFileChange}
                />
                <Form.Control.Feedback type="invalid">
                  Location map is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom14">
                <Form.Label>Reara Number</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Reara Number"
                  name="reraNo"
                  value={formData.reraNo || ""}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Reara Number is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom15">
                <Form.Label>Reara Website</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Reara Website"
                  name="reraWebsite"
                  value={formData.reraWebsite || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom16">
                <Form.Label>Project Logo</Form.Label>
                {formData.locationMap && (
                  <div>
                    <img
                      src={projectLogoPreview}
                      alt="Current Project Logo"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <br />
                  </div>
                )}
                <Form.Control
                  // required
                  type="file"
                  placeholder="Project Logo"
                  name="projectLogo"
                  onChange={handleFileChange}
                />
                <Form.Control.Feedback type="invalid">
                  Project logo is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom17">
                <Form.Label>Project Thumbnail</Form.Label>
                {formData.locationMap && (
                  <div>
                    <img
                      src={projectThumbnail}
                      alt="Current Project Thumbnail"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <br />
                  </div>
                )}
                <Form.Control
                  // required
                  type="file"
                  placeholder="Project Thumnnail"
                  name="projectThumbnail"
                  onChange={handleFileChange}
                />
                <Form.Control.Feedback type="invalid">
                  Project thumbnail is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom18">
                <Form.Label>Project Type</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="propertyType"
                  onChange={handleChange}
                  value={formData.propertyType || 0}
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
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom19">
                <Form.Label>Slug Url</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Slug Url"
                  name="slugURL"
                  value={formData.slugURL || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom85">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={formData.country || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group controlId="amenity_desc">
                <Form.Label>Amenity Description</Form.Label>
                <JoditEditor
                  ref={editor}
                  value={amenityDesc || ""}
                  onChange={(newcontent) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      amenityDesc: newcontent,
                    }))
                  }
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group controlId="amenity_desc">
                <Form.Label>Location Description</Form.Label>
                <JoditEditor
                  ref={editor}
                  value={locationDesc || ""}
                  onChange={(newcontent) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      locationDesc: newcontent,
                    }))
                  }
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group controlId="amenity_desc">
                <Form.Label>Floor Plan Description</Form.Label>
                <JoditEditor
                  ref={editor}
                  value={floorPlanDesc || ""}
                  onChange={(newcontent) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      floorPlanDesc: newcontent,
                    }))
                  }
                />
              </Form.Group>
            </Row>
            <Button className="mt-3" type="submit">
              {buttonName}
            </Button>
          </Form>
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
          <Button variant="danger" onClick={deleteProject}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}
