import Image from "next/image";
import './common.css';

export default function CommonHeaderBanner({ image, headerText }) {
  return (
    <div className="container-fluid p-0 position-relative">
      <div className="top-banner-each-pages">
        <Image
          src={`/static/${image}`}
          fill
          alt={headerText || ""}
        />
      </div>
      <p className="projects-heading">{headerText}</p>
    </div>
  );
}
