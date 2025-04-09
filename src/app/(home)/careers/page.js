import Image from "next/image";
import { Button } from "react-bootstrap";
import CommonBreadCrum from "../components/common/breadcrum";
import CommonHeaderBanner from "../components/common/commonheaderbanner";

export default function Career() {
  const jobsArr = [
    {
      id: 1,
      postName: "Sale's Manager",
      noOfVacencies: 3,
      imageUrl:
        "icon6.webp",
      location: "Noida",
    },
    {
      id: 2,
      postName: "Video Editor",
      noOfVacencies: 2,
      imageUrl:
        "icon6.webp",
      location: "Noida",
    },
    {
      id: 3,
      postName: "Content Writer",
      noOfVacencies: 3,
      imageUrl:
        "icon6.webp",
      location: "Noida",
    },
    {
      id: 4,
      postName: "React developer",
      noOfVacencies: 3,
      imageUrl:
        "icon6.webp",
      location: "Noida",
    },
    {
      id: 5,
      postName: "Web developer",
      noOfVacencies: 3,
      imageUrl:
        "icon6.webp",
      location: "Noida",
    },
  ];
  return (
    <>
      <CommonHeaderBanner image={"career.jpg"}/>
      <CommonBreadCrum pageName={"Career"} />
      <section className="d-flex justify-content-between mt-4 mx-lg-4">
        <p className="h1 w-50 mx-5">Your next career move starts here.</p>
        <div className="text-center">
          <Button>Find more jobs...</Button>
        </div>
      </section>
      <section className="d-flex justify-content-center flex-wrap gap-3 my-5">
        {jobsArr.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="p-4 border border-2 rounded rounded-3"
          >
            <div className="d-flex justify-content-center gap-3">
              <Image src={`/static/${item.imageUrl}`} alt="image" width={70} height={70} />
              <p className="h1 mt-3">{item.postName}</p>
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
