import ContactUs from "./page";

// export default async function generateMetadata({params}){
//     const title = "Contact Us";
//     const description = "Contact Us";
//     return {title, description};
// }
export const metadata = {
    title: "Contact us | My property fact",
    description: "Contact us",
  };

export default function ContactUsLayout(){
    return(
        <>
        {<ContactUs />}
        </>
    )
}