import { Button } from "react-bootstrap";

export default function DashboardHeader({ heading, buttonName, functionName }) {
    return (
        <div className="d-flex justify-content-between mt-3">
            <h1>{heading}</h1>
            <Button className="mx-3 btn btn-success text-capitalize" onClick={() => functionName()}>
                {buttonName}
            </Button>
        </div>
        
    )
}