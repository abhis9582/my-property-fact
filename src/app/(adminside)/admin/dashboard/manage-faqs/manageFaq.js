"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import CommonModal from "../common-model/common-model";
import DataTable from "../common-model/data-table";
import DashboardHeader from "../common-model/dashboardHeader";
import { useRouter } from "next/navigation";
export default function ManageFaqs({ list, projectsList }) {
    const router = useRouter();

    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [buttonName, setButtonName] = useState("");
    const [validated, setValidated] = useState(false);
    const [projectId, setProjectId] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const handleClose = () => setShow(false);
    const [faqId, setFaqId] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const [showConfirmationBox, setShowConfirmationBox] = useState(false);

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
                    router.refresh();
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


    //Handle delete faq
    const openConfirmationBox = (id) => {
        setFaqId(id);
        setShowConfirmationBox(true);
    };
    //Defining table columns
    const columns = [
        { field: "index", headerName: "S.no", width: 100, cellClassName: "centered-cell" },
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
    return (
        <>
            <DashboardHeader buttonName={"+ Add FAQ"} functionName={openAddModel} heading={"Manage FAQs"} />
            <div className="table-container mt-5">
                <DataTable columns={columns} list={list} />
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
                                {projectsList.map((item) => (
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
            <CommonModal
                confirmBox={showConfirmationBox}
                setConfirmBox={setShowConfirmationBox}
                api={`${process.env.NEXT_PUBLIC_API_URL}project-faqs/delete/${faqId}`}
            />
        </>
    );
}
