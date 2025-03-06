import CommonBreadCrum from "../components/common/breadcrum";
import Image from "next/image";
export default function ClientsSpeak() {
  return (
    <>
      <Image
        src="/static/clients-speak.webp"
        alt="clients-speak"
        height={400}
        width={1899}
        layout="responsive"
        className="mt-5"
      />
      <CommonBreadCrum pageName={"Client's speak"} />
    </>
  );
}
