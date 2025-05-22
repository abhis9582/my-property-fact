import { LoadingSpinner } from "../contact-us/page";

export default function LoadingAboutusPage(){
    return(
        <div className="d-flex justify-content-center align-items-center">
            <LoadingSpinner show={true}/>
        </div>
    )
}