"use client";
import { useState } from "react";
import { useSkills } from "@/hooks/useSkills";
import { addSkill, updateSkill, deleteSkill } from "@/services/skillService";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import toast from "react-hot-toast";

export const dynamic = 'force-dynamic';

const SKILL_CATEGORIES = [
  { value: "Frontend Development", label: "Frontend Development" },
  { value: "Backend Development", label: "Backend Development" },
  { value: "Tools & Platforms", label: "Tools & Platforms" },
  { value: "Programming Languages", label: "Programming Languages" },
  { value: "UI/UX & Design", label: "UI/UX & Design" },
];

export default function SkillsAdmin() {
  const { skills, loading, refetch } = useSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({ name: "", level: 50, category: "Frontend Development" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { label: "Skill Name", key: "name" },
    { label: "Category", key: "category" },
    { label: "Level", key: "level", render: (row) => `${row.level}%` },
  ];

  const handleOpenModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
      });
    } else {
      setEditingSkill(null);
      setFormData({ name: "", level: 50, category: "Frontend" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSave = { ...formData, level: Number(formData.level) };
      if (editingSkill) {
        await updateSkill(editingSkill.id, dataToSave);
        toast.success("Skill updated!");
      } else {
        await addSkill(dataToSave);
        toast.success("Skill added!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save skill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteSkill(id);
        toast.success("Skill deleted!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete.");
      }
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Skills"
        description="Manage skills and proficiency levels on your portfolio."
        action={
          <Button variant="gradient" onClick={() => handleOpenModal()}>
            Add Skill
          </Button>
        }
      />

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={skills} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingSkill ? "Edit Skill" : "Add Skill"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Skill Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Select label="Category" options={SKILL_CATEGORIES} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
          <Input label="Proficiency Level (0-100)" type="number" min="0" max="100" value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} required />

          <Button variant="gradient" type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save Skill"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
