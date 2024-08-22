import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

const Page = ({ element, path }) => {
  const params = useParams();
  const [metadata, setMetadata] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Use the path and params to construct the slug
        const constructedSlug = path
          .split("/")
          .map((part) =>
            part.startsWith(":") ? params[part.substring(1)] : part
          )
          .join("/");

        const response = await fetch(
          `http://localhost:3000/api/${constructedSlug}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch page metadata");
        }
        console.log("Constructed Slug:", constructedSlug);

        const data = await response.json();

        setMetadata(data);
      } catch (error) {
        console.error("Error fetching page metadata:", error);
      }
    };

    fetchMetadata();
    console.log("Path:", path);
    console.log("Params:", params);
  }, [path, params]);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>
      {React.cloneElement(element, { params })}
    </>
  );
};

export default Page;
