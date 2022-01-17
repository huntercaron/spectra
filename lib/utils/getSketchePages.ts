import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "pages/sketches");

export function getSketchPages() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.tsx$/, "");

    // Read markdown file as string
    // const fullPath = path.join(postsDirectory, fileName)
    // const fileContents = fs.readFileSync(fullPath, "utf8")
    const slug = `/sketches/${id}`;

    // Combine the data with the id
    return {
      id,
      slug,
    };
  });
  // Sort posts by date
  return allPostsData;
}
