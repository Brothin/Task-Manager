import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects", error);
      }
    };

    fetchProjects();
  }, []);

  const handleExportGist = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/projects/export-gist/${projectId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`Gist created! Check it here: ${response.data.gistUrl}`);
    } catch (error) {
      alert("Failed to export project summary.");
      console.error(error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl mb-6 font-semibold">My Projects</h2>
      <button
        onClick={() => navigate("/projects/new")}
        className="mb-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200"
      >
        Create New Project
      </button>
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div key={project._id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p>{project.description}</p>
            <button
              onClick={() => navigate(`/projects/${project._id}`)}
              className="mt-2 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200"
            >
              View Project
            </button>
            <button
              onClick={() => handleExportGist(project._id)}
              className="mt-2 bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition duration-200"
            >
              Export as Gist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
