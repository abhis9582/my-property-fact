"use client";
import Image from "next/image";
import { Button } from "react-bootstrap";
import CommonBreadCrum from "../components/common/breadcrum";
import CommonHeaderBanner from "../components/common/commonheaderbanner";

export default function Career({ jobsArr }) {
  return (
    <>
      <CommonHeaderBanner image={"career.jpg"} headerText={"Career"} />
      <CommonBreadCrum pageName={"Career"} />
      <section className="container d-flex justify-content-between mt-4">
        <h1>Your next career move starts here.</h1>
        <div className="text-center">
          <Button className="btn btn-background border-0 custom-shadow">
            Find more jobs...
          </Button>
        </div>
      </section>
      <section className="d-flex justify-content-center flex-wrap gap-3 my-5">
        {jobsArr.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="p-4 border rounded rounded-3 custom-shadow"
          >
            <div className="d-flex justify-content-center gap-3">
              <Image
                src={`/static/${item.imageUrl}`}
                alt="image"
                width={70}
                height={70}
              />
              <h3 className="mt-3">{item.postName}</h3>
            </div>
            <div className="d-flex justify-content-around mt-4">
              <p className="fs-4">location: {item.location}</p>
              <p className="fs-4">vacancies: {item.noOfVacencies}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
