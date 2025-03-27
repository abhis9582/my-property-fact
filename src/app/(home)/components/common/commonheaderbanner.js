import Image from "next/image";

export default function CommonHeaderBanner({ image, headerText }) {
  return (
    <div className="container-fluid p-0 position-relative">
      <Image
        src={`/static/${image}`}
        width={1899}
        height={500}
        layout="responsive"
        alt={headerText || ""}
      />
      <p className="projects-heading">{headerText}</p>
    </div>
  );
}
