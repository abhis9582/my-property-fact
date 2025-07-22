import Image from "next/image";
import Link from "next/link";
import { Button } from "react-bootstrap";
import "./common.css";

export default function MpfTopPicks() {
  return (
    <>
      <div className="container pt-5 top-space">
        <div className="d-flex flex-wrap justify-content-between mb-3">
          <div>
            <h2 className="fs-1">My Property Fact&#39;s Top Picks</h2>
            <p className="fs-3">Explore top living options with us</p>
          </div>
          {/* <div className="position-relative top-pick-mobile-container
          overflow-hidden">
            <Image
              src="/properties/birla-arika/72cd9fcd-3448-40ab-a5db-38b48be88c2f.jpg"
              alt="Birla Arika"
              width={300}
              height={150}
              className="rounded-4 golden-border"
            />
            <div className="position-absolute  d-md-none bottom-0 ps-2 pb-4">
              <h2 className="fs-6 m-0 p-0">Birla Arika</h2>
              <p className="fs-6 m-0 p-0">Aya Nagar, South Delhi, New Delhi</p>
              <h2 className="fs-6 m-0 p-0">1.38 Cr - 2.13 Cr</h2>
              <p className="fs-6 m-0 p-0">3, 4 BHK Apartments</p>
              <Button className="gradient-bg border-0">Contact</Button>
            </div>
            <div className="overlay-bg d-md-none"></div>
          </div> */}
        </div>
        <div className="row mb-5 border rounded-3 p-2 d-none d-md-flex mpf-top-picks">
          <div className="col-md-5 d-flex justify-content-center align-items-center">
            <div>
              <div className="d-flex align-items-center justify-centent-center">
                <div className="rounded-3">
                  <Image
                    src="/logo.png"
                    alt="Birla Arika"
                    width={80}
                    height={80}
                    className="img-fluid"
                  />
                </div>
                <div className="ms-4">
                  <h4 className="fs-4 m-0 p-0">Birla Arika</h4>
                  <Link href="/projects" className="fs-6">
                    View Projects
                  </Link>
                </div>
              </div>
              <div className="my-4">
                <h2>Birla Arika</h2>
                <p>Aya Nagar, South Delhi, New Delhi</p>
              </div>
              <div className="my-4">
                <h2>1.38 Cr - 2.13 Cr</h2>
                <p>3, 4 BHK Apartments</p>
              </div>
              <div className="my-4">
                <Button className="gradient-bg border-0 w-100 p-3 fw-bold fs-4">
                  Contact
                </Button>
              </div>
            </div>
          </div>
          <div className="col-md-7 m-0 p-0">
            <Image
              src="/properties/birla-arika/72cd9fcd-3448-40ab-a5db-38b48be88c2f.jpg"
              alt="top-picks"
              fill
              className="img-fluid rounded-5 position-relative"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </div>
      </div>
    </>
  );
}
