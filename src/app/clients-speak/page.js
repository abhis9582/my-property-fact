import Footer from "../components/footer/page";
import Header from "../components/header/page";
import Image from "next/image";
export default function ClientsSpeak() {
  return (
    <>
      <Header />
        <Image 
          src="/static/clients-speak.webp"
          alt="clients-speak"
          height={400}
          width={1899}
          layout="responsive"
          className="mt-5"
        />
      <Footer />
    </>
  );
}
