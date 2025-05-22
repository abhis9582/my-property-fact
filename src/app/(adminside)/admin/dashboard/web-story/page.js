import { Button } from "react-bootstrap";

export default function WebStroy() {
    return (
        <>
            <div className="d-flex justify-content-between mt-3">
                <h1 className="text-capitalize">Manage web story</h1>
                <Button className="text-capitalize btn-success border-0">
                    + Add new story
                </Button>
            </div>
        </>
    )
}