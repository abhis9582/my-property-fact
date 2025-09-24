import { getAllProjects } from "@/app/_global_components/masterFunction";
import Projects from "./projects";
import NewProjectListPage from "./newProjectListPage";

export const metadata = {
  title:
    "Explore Real Estate Projects | New & Upcoming Properties - MyPropertyFact",
  description:
    "Browse top residential and commercial real estate projects across India. Discover new launches, ongoing developments, and upcoming properties with MyPropertyFact.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_ROOT_URL}projects`,
  },
};
export default async function ProjectsPage() {
  const projects = await getAllProjects();
  console.log(
    `Projects loaded by /projects page and count is ${projects.length}.`
  );

  return (
    <>
      {/* <Projects projects={projects} /> */}
      <NewProjectListPage projects={projects} />
    </>
  );
}
