"use client";
import { useState } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { addTestimonial, updateTestimonial, deleteTestimonial } from "@/services/testimonialService";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

export default function TestimonialsAdmin() {
  const { testimonials, loading, refetch } = useTestimonials();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({ name: "", role: "", content: "", rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { label: "Name", key: "name" },
    { label: "Role/Company", key: "role" },
    { 
      label: "Rating", 
      key: "rating",
      render: (row) => (
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} size={14} className={i < row.rating ? "" : "text-gray-600"} />
          ))}
        </div>
      )
    },
  ];

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        rating: testimonial.rating || 5,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({ name: "", role: "", content: "", rating: 5 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, { ...formData, rating: Number(formData.rating) });
        toast.success("Testimonial updated!");
      } else {
        await addTestimonial({ ...formData, rating: Number(formData.rating) });
        toast.success("Testimonial added!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save testimonial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteTestimonial(id);
        toast.success("Testimonial deleted!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete.");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Testimonials</h1>
        <Button variant="gradient" onClick={() => handleOpenModal()}>
          Add Testimonial
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={testimonials} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Client Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Input label="Role or Company" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required />
          <Input label="Rating (1-5)" type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} required />
          <Input label="Review Content" type="textarea" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required />

          <Button variant="gradient" type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save Testimonial"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
