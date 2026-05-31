"use client";
import { useState } from "react";
import { useExperiences } from "@/hooks/useExperiences";
import { addExperience, updateExperience, deleteExperience } from "@/services/experienceService";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export const dynamic = 'force-dynamic';

export default function ExperienceAdmin() {
  const { experiences, loading, refetch } = useExperiences();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState({ title: "", company: "", type: "Full-time", date: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { label: "Role", key: "title" },
    { label: "Company", key: "company" },
    { label: "Date", key: "date" },
    { label: "Type", key: "type" },
  ];

  const handleOpenModal = (exp = null) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({
        title: exp.title,
        company: exp.company,
        type: exp.type || "Full-time",
        date: exp.date,
        description: exp.description,
      });
    } else {
      setEditingExp(null);
      setFormData({ title: "", company: "", type: "Full-time", date: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingExp) {
        await updateExperience(editingExp.id, formData);
        toast.success("Experience updated!");
      } else {
        await addExperience(formData);
        toast.success("Experience added!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save experience.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteExperience(id);
        toast.success("Record deleted!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete.");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Experience</h1>
        <Button variant="gradient" onClick={() => handleOpenModal()}>
          Add Experience
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={experiences} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingExp ? "Edit Experience" : "Add Experience"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Role Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          <Input label="Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} required />
          <Input label="Employment Type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required placeholder="e.g. Full-time, Freelance" />
          <Input label="Date Range" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required placeholder="e.g. 2023 - Present" />
          <Input label="Description" type="textarea" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />

          <Button variant="gradient" type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save Record"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
