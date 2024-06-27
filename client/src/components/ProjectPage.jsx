import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { Navigation } from 'swiper/modules';
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

SwiperCore.use([Navigation]);

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/project/get/${projectId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setProject(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something Went Wrong!</p>
      )}

      {project && !loading && !error && (
        <div>
          <Swiper navigation>
            {project.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{ background: `url(${url}) center no-repeat`, backgroundSize: "cover" }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[35%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {project.developer} | {project.community.name} | {project.name} - UAE{" "}
           
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {project.address}
            </p>
         
        
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {project.description}
            </p>
          
          </div>
        </div>
      )}
    </main>
  );
}
