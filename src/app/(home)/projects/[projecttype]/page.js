import { fetchAllProjectsByProjectType } from "@/app/_global_components/masterFunction";
import PropertyPage from "./propertypage";

//Generating metatitle and meta description
export async function generateMetadata({ params }) {
  try {
    const { projecttype } = await params;
    const response = await fetchAllProjectsByProjectType(projecttype);
    return {
      title: response.metaTitle || `Projects - ${projecttype}`,
      description: response.metaDesc || `Browse ${projecttype} projects`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_ROOT_URL}projects/${projecttype}`,
      },
    };
  } catch (error) {
    return {
      title: `Projects - ${params.projecttype}`,
      description: `Browse ${params.projecttype} projects`,
    };
  }
}

export default async function ProjectType({ params }) {
  const { projecttype } = await params;
  const projectTypeDetail = await fetchAllProjectsByProjectType(projecttype);
  return <PropertyPage projectTypeDetails={projectTypeDetail} />
}
