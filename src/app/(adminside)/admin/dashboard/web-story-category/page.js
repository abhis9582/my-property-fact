import { Button } from "react-bootstrap";

export default function WebStoryCategory() {
    return (
        <>
            <div className="d-flex justify-content-between mt-3">
                <h1 className="text-capitalize">Manage web story category</h1>
                <Button className="text-capitalize btn-success border-0">
                    + Add story category
                </Button>
            </div>
        </>
    )
}