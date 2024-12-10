import Header from "@/app/components/header/page";
import PropertyPage from "./propertypage";
import Footer from "@/app/components/footer/page";


export default async function ProjectType({params}){
    const {projecttype} = await params; 
    return(
        <>
        <Header/>
            <PropertyPage type={projecttype}/>
            <Footer />
        </>
    )
}