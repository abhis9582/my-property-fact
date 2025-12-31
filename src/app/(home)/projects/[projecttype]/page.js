import PropertyPage from "./propertypage";
import axios from "axios";
export const dynamic = 'force-dynamic';
//Fetching details of project type 
const fetchProjectTypeDetails = async (slug) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}projects/all-projects`
    );
    const allProjects = response.data || [];
    
    let projectList = [];
    let projectTypeName = '';
    
    // Handle "New Launches" as a special case - filter by project status instead of project type
    if (slug === "new-launches" || slug.toLowerCase() === "new-launches") {
      projectList = allProjects.filter(project => {
        return project.projectStatus === 'New Launched';
      });
      projectTypeName = 'New Launches';
    } else {
      // Normalize slug: replace hyphens with spaces and convert to lowercase
      const normalizedSlug = slug.replace(/-/g, ' ').toLowerCase().trim();
      
      // Filter projects by project type (case-insensitive comparison)
      projectList = allProjects.filter(project => {
        if (!project.projectType) return false;
        const projectType = project.projectType.toLowerCase().trim();
        return projectType === normalizedSlug;
      });
      
      // Get project type name from first project or generate from slug
      projectTypeName = projectList.length > 0 
        ? projectList[0].projectType 
        : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return {
      projectTypeName: projectTypeName,
      projectList: projectList
    };
  } catch (error) {
    console.error("Error fetching project type details:", error);
    return {
      projectTypeName: slug === "new-launches" ? "New Launches" : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      projectList: []
    };
  }
}

//Generating metatitle and meta description
export async function generateMetadata({ params }) {
  const { projecttype } = await params;
  const response = await fetchProjectTypeDetails(projecttype);
  const projectTypeName = response.projectTypeName || projecttype.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${projectTypeName} Projects | My Property Fact`,
    description: `Browse our collection of ${projectTypeName.toLowerCase()} projects. Find the perfect property that matches your needs.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_ROOT_URL}projects/${projecttype}`,
    },
  };
}

export default async function ProjectType({ params }) {
  const { projecttype } = await params;
  const [projectTypeDetail] = await Promise.all([
    fetchProjectTypeDetails(projecttype)
  ]);  
  return <PropertyPage projectTypeDetails={projectTypeDetail} />
}
