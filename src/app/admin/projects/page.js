"use client";
import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { addProject, updateProject, deleteProject } from "@/services/projectService";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";
import Select from "@/components/ui/Select";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import toast from "react-hot-toast";

const PROJECT_CATEGORIES = [
  { value: "Full Stack", label: "Full Stack" },
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
];

export default function ProjectsAdmin() {
  const { projects, loading, refetch } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", image: "", techStack: "", github: "", liveUrl: "", category: "Full Stack" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { label: "Title", key: "title" },
    { label: "Category", key: "category" },
    { label: "Tech Stack", key: "techStack", render: (row) => row.techStack?.join(", ") || row.techStack },
  ];

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image || "",
        techStack: Array.isArray(project.techStack) ? project.techStack.join(", ") : project.techStack,
        github: project.github || "",
        liveUrl: project.liveUrl || "",
        category: project.category || "Full Stack",
      });
    } else {
      setEditingProject(null);
      setFormData({ title: "", description: "", image: "", techStack: "", github: "", liveUrl: "", category: "Full Stack" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const dataToSave = {
      ...formData,
      techStack: formData.techStack.split(",").map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingProject) {
        await updateProject(editingProject.id, dataToSave);
        toast.success("Project updated!");
      } else {
        await addProject(dataToSave);
        toast.success("Project added!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete.");
      }
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Add and edit projects shown on your portfolio."
        action={
          <Button variant="gradient" onClick={() => handleOpenModal()}>
            Add Project
          </Button>
        }
      />

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={projects} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingProject ? "Edit Project" : "Add Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          <Select label="Category" options={PROJECT_CATEGORIES} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
          <Input label="Description" type="textarea" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
          <Input label="Tech Stack (comma separated)" value={formData.techStack} onChange={(e) => setFormData({...formData, techStack: e.target.value})} />
          <Input label="GitHub URL" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} />
          <Input label="Live URL" value={formData.liveUrl} onChange={(e) => setFormData({...formData, liveUrl: e.target.value})} />
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Project Image</label>
            <ImageUploader 
              value={formData.image} 
              onChange={(url) => setFormData({...formData, image: url})} 
              folder="projects"
              useLocalStorage={true}
            />
          </div>

          <Button variant="gradient" type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save Project"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
