/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_UI_URL,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  transform: async (config, path) => {
    const dynamicPatterns = [
      "/projects/[projecttype]",
      "/[property]",
      "/builder/[buildername]",
      "/blog/[blogpage]",
    ];

    if (dynamicPatterns.some((pattern) => path.includes(pattern))) {
      return null;
    }

    return {
      loc: path, // URL to include
      changefreq: config.changefreq, // how often it changes (daily/weekly)
      priority: config.priority, // importance (0–1)
      lastmod: new Date().toISOString(), // last modified date
    };
  },

  additionalPaths: async (config) => {
    let allPaths = [];

    // Projects
    const projectsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`
    );
    const projects = await projectsRes.json();

    allPaths = allPaths.concat(
      projects.map((p) => ({
        loc: `/${p.slugURL}`, //
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }))
    );

    // Blogs
    const blogsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}blog/get-all`
    );
    const blogs = await blogsRes.json();

    allPaths = allPaths.concat(
      blogs.map((b) => ({
        loc: `/blog/${b.slugUrl}`,
        changefreq: "monthly",
        priority: 0.6,
        lastmod: new Date().toISOString(),
      }))
    );

    // Builders
    const buildersRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}builder/get-all`
    );
    const buildersObj = await buildersRes.json();

    allPaths = allPaths.concat(
      buildersObj.builders.map((prop) => ({
        loc: `/builder/${prop.slugUrl}`,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }))
    );

    // Cities
    const citiesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}city/all`
    );
    const cities = await citiesRes.json();

    allPaths = allPaths.concat(
      cities.map((prop) => ({
        loc: `/city/${prop.slugURL}`,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }))
    );

    // Project types
    const projectTypesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
    );
    const projectTypes = await projectTypesRes.json();

    allPaths = allPaths.concat(
      projectTypes.map((prop) => ({
        loc: `/projects/${prop.slugUrl}`,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }))
    );

    // Web stories
    const webstoriesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}web-story-category/get-all`
    );
    const webstories = await webstoriesRes.json();

    allPaths = allPaths.concat(
      webstories.map((prop) => ({
        loc: `${process.env.NEXT_PUBLIC_API_URL}web-story/${prop.categoryName}`,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }))
    );

    return allPaths;
  },
};
