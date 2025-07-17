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
import { useRouter } from "next/navigation";
// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
export default function ManageProjects({ builderList, typeList, countryData, projectDetailList,
    projectStatusList
 }) {

    const editor = useRef(null);
    const router = useRouter();

    // Defining the initial state
    const initialFormData = {
        amenities: [],
        id: 0,
        metaTitle: "",
        metaKeyword: "",
        metaDescription: "",
        projectName: "",
        stateId: "",
        cityId: "",
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
        amenityDescription: "",
        locationDescription: "",
        floorPlanDescription: "",
        countryId: "",
        projectStatus: ""
    };

    const [validated, setValidated] = useState(false);
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
    const [locationPreview, setLocationPreview] = useState(null);
    const [projectThumbnailPreview, setProjectThumbnailPreview] = useState(null);
    const [projectLogoPreview, setProjectLogoPreview] = useState(null);
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [selectedStateId, setSelectedStateId] = useState('');
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const handleCountryChange = (e) => {
        const countryId = parseInt(e.target.value);
        setFormData((prev) => ({
            ...prev,
            country: String(countryId),
        }));
        setSelectedCountryId(countryId);
        const country = countryData.find(c => c.countryId === countryId);
        setStates(country ? country.states : []);
        setSelectedStateId('');
        setCities([]);
    };

    const handleStateChange = (e) => {
        const stateId = parseInt(e.target.value);
        setFormData((prev) => ({
            ...prev,
            state: String(stateId),
        }));
        setSelectedStateId(stateId);
        const state = states.find(s => s.stateId === stateId);
        setCities(state ? state.cities : []);
    };

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
        const country = countryData.find(c => c.countryId === item.country);
        setStates(country ? country.states : []);
        const state = country.states?.find(s => s.stateId === item.state);
        setCities(state ? state.cities : []);
    };

    //Opening delete confirmation box
    const openConfirmationBox = (id) => {
        setConfirmBox(true);
        setProjectId(id);
    };

    //Handling form data changes
    // const handleChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: type === "checkbox" ? checked : value,
    //     });
    // };
    const handleChange = (e) => {
        const { name, type, files, value } = e.target;

        if (type === "file") {
            const file = files[0];
            if (file) {
                const previewUrl = URL.createObjectURL(file);
                setFormData((prev) => ({
                    ...prev,
                    [name]: file,
                    [`${name}Preview`]: previewUrl,
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
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
        event.stopPropagation();
        debugger
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            // Scroll to the first invalid field
            const firstInvalid = form.querySelector(":invalid");
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
                firstInvalid.focus();
            }
        }
        setValidated(true);

        if (form.checkValidity()) {
            const data = new FormData();
            for (let key in formData) {
                if (key === "amenities") continue; 
                data.append(key, formData[key]);
            }
            try {
                debugger
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
                    router.refresh();
                    toast.success(response.data.message);
                    setFormData(initialFormData);
                    setShowModal(false);
                }
            } catch (error) {
                toast.error("Error saving Project");
            } finally {
                setShowLoading(false);
            }
        }
    };

    const formFields = [
        {
            label: "Meta Title",
            name: "metaTitle",
            type: "text",
            placeholder: "Meta Title",
            required: true,
            colSize: 6,
        },
        {
            label: "Meta Description",
            name: "metaDescription",
            type: "text",
            placeholder: "Meta Description",
            required: true,
            colSize: 6,
        },
        {
            label: "Meta Keyword",
            name: "metaKeyword",
            type: "text",
            placeholder: "Meta Keyword",
            required: true,
            colSize: 6,
        },
        {
            label: "Project Name",
            name: "projectName",
            type: "text",
            placeholder: "Project Name",
            required: true,
            colSize: 6,
        },
        {
            label: "Project Locality",
            name: "projectLocality",
            type: "text",
            placeholder: "Project Locality",
            required: true,
            colSize: 6,
        },
        {
            label: "Country",
            name: "country",
            type: "select",
            required: true,
            colSize: 6,
            options: countryData,
            valueKey: "countryId",
            labelKey: "countryName",
            onChange: handleCountryChange,
        },
        {
            label: "State",
            name: "state",
            type: "select",
            required: true,
            colSize: 6,
            options: states,
            valueKey: "stateId",
            labelKey: "stateName",
            onChange: handleStateChange,
            disabled: !states.length,
        },
        {
            label: "City",
            name: "city",
            type: "select",
            required: true,
            colSize: 6,
            options: cities,
            valueKey: "id",
            labelKey: "cityName",
            disabled: !cities.length,
        },
        {
            label: "Project Configuration",
            name: "projectConfiguration",
            type: "text",
            placeholder: "Project Configuration",
            required: true,
            colSize: 6,
        },
        {
            label: "Project By",
            name: "projectBy",
            type: "select",
            required: true,
            colSize: 6,
            options: builderList,
            valueKey: "id",
            labelKey: "builderName",
        },
        {
            label: "Location Map",
            name: "locationMap",
            previousImage: locationPreview,
            type: "file",
            required: false,
            colSize: 6,
        },
        {
            label: "Project Logo",
            name: "projectLogo",
            previousImage: projectLogoPreview,
            type: "file",
            required: false,
            colSize: 6,
        },
        {
            label: "Project Thumbnail",
            name: "projectThumbnail",
            previousImage: projectThumbnailPreview,
            type: "file",
            required: false,
            colSize: 6,
        },
        {
            label: "Project price",
            name: "projectPrice",
            type: "text",
            placeholder: "Project price",
            required: true,
            colSize: 6,
        },
        {
            label: "Rera Number",
            name: "reraNo",
            type: "text",
            placeholder: "Reara Number",
            required: true,
            colSize: 6,
        },
        {
            label: "Rera website",
            name: "reraWebsite",
            type: "text",
            placeholder: "Rera website",
            required: false,
            colSize: 6,
        },
        {
            label: "Slug Url",
            name: "slugURL",
            type: "text",
            placeholder: "Slug url",
            required: false,
            colSize: 6,
        },
        {
            label: "IVR number",
            name: "ivrNo",
            type: "text",
            placeholder: "IVR number",
            required: false,
            colSize: 6,
        },
        {
            label: "Property type",
            name: "propertyType",
            type: "select",
            required: true,
            colSize: 6,
            options: typeList,
            valueKey: "id",
            labelKey: "projectTypeName",
        },
        {
            label: "Project Status",
            name: "projectStatus",
            type: "select",
            required: true,
            colSize: 6,
            options: projectStatusList,
            valueKey: "id",
            labelKey: "statusName",
        },
        {
            label: "Amenity Description",
            name: "amenityDesc",
            type: "jodit",
            value: amenityDesc,
            required: true,
            colSize: 12, // full width
        },
        {
            label: "Location Description",
            name: "locationDesc",
            type: "jodit",
            value: locationDesc,
            required: true,
            colSize: 12, // full width
        },
        {
            label: "Floor Plan Description",
            name: "floorPlanDesc",
            type: "jodit",
            value: floorPlanDesc,
            required: true,
            colSize: 12, // full width
        },
    ];

    //Defining table columns
    const columns = [
        {
            field: "index", headerName: "S.no",
            width: 100,
            cellClassName: "centered-cell",
        },
        {
            field: "projectName", headerName: "Project Name",
            flex: 1,
        },
        {
            field: "builderName", headerName: "Project By",
            flex: 1,
        },
        {
            field: "projectLocality",
            headerName: "Project Locality",
            flex: 1,
        },
        {
            field: "projectConfiguration",
            headerName: "Project Configuration",
            flex: 1,
        },
        {
            field: "typeName",
            headerName: "Property Type",
            flex: 1,
        },
        {
            field: "projectStatusName",
            headerName: "Project Status",
            flex: 1,
        },
        {
            field: "action",
            headerName: "Action",
            width: 100,
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
                        <Row>
                            {formFields.map((field, index) => (
                                <Form.Group
                                    as={Col}
                                    md={field.colSize || 6}
                                    className="mb-3"
                                    controlId={`form-${field.name}`}
                                    key={index}
                                >
                                    <Form.Label>{field.label}</Form.Label>

                                    {field.type === "jodit" ? (
                                        <JoditEditor
                                            value={field.value || ""}
                                            onBlur={(newContent) =>
                                                setFormData((prev) => ({ ...prev, [field.name]: newContent }))
                                            }
                                        />
                                    ) : field.type === "select" ? (
                                        <Form.Select
                                            name={field.name}
                                            value={formData[field.name] ?? ""}
                                            onChange={field.onChange || handleChange}
                                            disabled={field.disabled}
                                            required={field.required}
                                        >
                                            <option value="">Select {field.label}</option>
                                            {field.options?.map((opt) => (
                                                <option key={opt[field.valueKey]} value={opt[field.valueKey]}>
                                                    {opt[field.labelKey]}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    ) : field.type === "file" ? (
                                        <>
                                            {field.previousImage && (
                                                <div>
                                                    <Image
                                                        src={field.previousImage}
                                                        alt="Current Project Logo"
                                                        width={200}
                                                        height={100}
                                                        unoptimized
                                                    />
                                                    <br />
                                                </div>
                                            )}
                                            <Form.Control
                                                type="file"
                                                name={field.name}
                                                onChange={field.onChange || handleChange}
                                                required={field.required}
                                                disabled={field.disabled}
                                            />
                                        </>
                                    ) : (
                                        <Form.Control
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            value={formData[field.name] || ""}
                                            onChange={field.onChange || handleChange}
                                            required={field.required}
                                            disabled={field.disabled}
                                        />
                                    )}
                                    <Form.Control.Feedback type="invalid">
                                        {field.label} is required!
                                    </Form.Control.Feedback>
                                </Form.Group>
                            ))}
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
