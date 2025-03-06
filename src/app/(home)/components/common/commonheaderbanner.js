import Image from "next/image";

export default function CommonHeaderBanner({ image, headerText }) {
  return (
    <div className="container-fluid p-0 mt-5 postion-relative">
      <Image
        src={`/static/${image}`}
        width={1899}
        height={500}
        layout="responsive"
        alt={headerText || ""}
      />
      <p className="projects-heading fs-1 position-absolute top-50 start-50 translate-middle text-white fw-bold">{headerText}</p>
    </div>
  );
}
