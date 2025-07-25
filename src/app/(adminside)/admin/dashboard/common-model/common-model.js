"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

export default function CommonModal({ confirmBox, setConfirmBox, api, fetchAllHeadersList }) {
  const router = useRouter();
  const deleteData = async () => {
    try {
      const response = await axios.delete(api);
      if (response && response.data && response.data.message) {

        toast.success(response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
      setConfirmBox(false);
      // fetchAllHeadersList();
      router.refresh();
    } catch (error) {
      toast.error("Error deleting data. Please try again.");
      console.error("Delete Error:", error);
    }
  };

  return (
    <>
      <Modal show={confirmBox} onHide={() => setConfirmBox(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete?</Modal.Title>
        </Modal.Header>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={() => setConfirmBox(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteData}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
