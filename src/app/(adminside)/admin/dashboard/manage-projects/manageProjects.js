"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import CommonModal from "../common-model/common-model";
import DataTable from "../common-model/data-table";
import DashboardHeader from "../common-model/dashboardHeader";
// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
export default function ManageProjects({ builderList }) {

    const editor = useRef(null);

    // Defining the initial state
    const initialFormData = {
        id: 0,
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
        projectStatus: "",
        locationMap: null,
        reraNo: "",
        reraWebsite: "",
        projectLogo: null,
        projectThumbnail: null,
        propertyType: 0,
        slugURL: "",
        showFeaturedProperties: true,
        status: true,
        amenityDesc: "",
        locationDesc: "",
        floorPlanDesc: "",
        country: "",
    };

    const [validated, setValidated] = useState(false);
    const [projectTypeList, setProjectTypeList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [amenityDesc, setAmenityDesc] = useState("");
    const [floorPlanDesc, setFloorPlanDesc] = useState("");
    const [locationDesc, setLocationDesc] = useState("");
    const [confirmBox, setConfirmBox] = useState(false);
    const [buttonName, setButtonName] = useState("");
    const [projectId, setProjectId] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [projectDetailList, setProjectDetailList] = useState([]);
    const [locationPreview, setLocationPreview] = useState(null);
    const [projectThumbnailPreview, setProjectThumbnailPreview] = useState(null);
    const [projectLogoPreview, setProjectLogoPreview] = useState(null);

    //Handle opening model
    const openAddModel = () => {
        setTitle("Add New Project");
        setShowModal(true);
        setButtonName("Add Project");
        setFormData(initialFormData);
        setAmenityDesc("");
        setFloorPlanDesc("");
        setLocationDesc("");
        setProjectLogoPreview(null);
        setProjectThumbnailPreview(null);
        setLocationPreview(null);
        setValidated(false);
    };
    //Handling opening of edit model
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
        setProjectThumbnailPreview(
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
            projectThumbnail: null,
        });
    };

    //Opening delete confirmation box
    const openConfirmationBox = (id) => {
        setConfirmBox(true);
        setProjectId(id);
    };

    //fetching all project list details
    const fetchProjectsWithDetail = async () => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}projects/get-all`
        );
        const res = response.data;
        const list = res.map((item, index) => ({
            ...item,
            index: index + 1,
        }));
        setProjectDetailList(list);
    };
    useEffect(() => {
        fetchProjectsWithDetail();
    }, []);

    //Handling form data changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };
    //Handling file changing
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({
            ...formData,
            [name]: files[0],
        });
    };
    // Handling submitting project
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
                setShowLoading(true);
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
                    setShowModal(false);
                    fetchProjectsWithDetail();
                }
            } catch (error) {
                toast.error("Error saving Project");
            } finally {
                setShowLoading(false);
            }
        }
    };
    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 100, cellClassName: "centered-cell", },
        { field: "projectName", headerName: "Project Name", width: 180 },
        { field: "projectBy", headerName: "Project By", width: 150 },
        {
            field: "projectLocality",
            headerName: "Project Locality",
            width: 239,
        },
        {
            field: "projectConfiguration",
            headerName: "Project Configuration",
            width: 260,
        },
        {
            field: "propertyType",
            headerName: "Property Type",
            width: 150,
        },
        {
            field: "action",
            headerName: "Action",
            width: 150,
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
    return (
        <>
            <DashboardHeader buttonName={'+ Add new Project'} functionName={openAddModel} heading={'Manage Projects'} />
            <div className="table-container mt-5">
                <DataTable list={projectDetailList} columns={columns} />
            </div>
            {/* Modal for adding a new project */}
            <Modal size="xl" show={showModal} onHide={() => setShowModal(false)} centered>
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
                                {locationPreview && (
                                    <div>
                                        <Image
                                            src={locationPreview}
                                            alt="Current Project locationmap"
                                            width={200}
                                            height={100}
                                            unoptimized
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
                                {projectLogoPreview && (
                                    <div>
                                        <Image
                                            src={projectLogoPreview}
                                            alt="Current Project Logo"
                                            width={200}
                                            height={100}
                                            unoptimized
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
                                {projectThumbnailPreview && (
                                    <div>
                                        <Image
                                            src={projectThumbnailPreview}
                                            alt="Current Project Thumbnail"
                                            width={100}
                                            height={100}
                                            unoptimized
                                        />
                                        <br />
                                    </div>
                                )}
                                <Form.Control
                                    // required
                                    type="file"
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
                        <Button className="mt-3 btn btn-success" type="submit" disabled={showLoading}>
                            {buttonName} <LoadingSpinner show={showLoading} />
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <CommonModal
                confirmBox={confirmBox}
                setConfirmBox={setConfirmBox}
                api={`${process.env.NEXT_PUBLIC_API_URL}projects/delete/${projectId}`}
            />
        </>
    );
}
