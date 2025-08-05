import Career from "./career";

export const metadata = {
  title: "Careers at MyPropertyFact | Join Our Real Estate Innovation Team",
  description:
    "Explore exciting career opportunities at MyPropertyFact. Join a passionate team shaping the future of real estate data, insights, and technology in India.",
};

const jobsArr = [
  {
    id: 1,
    postName: "Sale's Manager",
    noOfVacencies: 3,
    imageUrl: "icon6.webp",
    location: "Noida",
  },
  {
    id: 2,
    postName: "Video Editor",
    noOfVacencies: 2,
    imageUrl: "icon6.webp",
    location: "Noida",
  },
  {
    id: 3,
    postName: "Content Writer",
    noOfVacencies: 3,
    imageUrl: "icon6.webp",
    location: "Noida",
  },
  {
    id: 4,
    postName: "React developer",
    noOfVacencies: 3,
    imageUrl: "icon6.webp",
    location: "Noida",
  },
  {
    id: 5,
    postName: "Web developer",
    noOfVacencies: 3,
    imageUrl: "icon6.webp",
    location: "Noida",
  },
];
export default function CareerPage() {
  return <Career jobsArr={jobsArr}/>;
}
