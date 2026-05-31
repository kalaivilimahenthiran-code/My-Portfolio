"use client";
import { useState } from "react";
import { useServices } from "@/hooks/useServices";
import { addService, updateService, deleteService } from "@/services/serviceService";
import DataTable from "@/components/admin/DataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { SERVICE_ICON_OPTIONS } from "@/lib/serviceIcons";
import toast from "react-hot-toast";

export const dynamic = 'force-dynamic';

const emptyForm = { title: "", description: "", icon: "HiDesktopComputer" };

export default function ServicesAdmin() {
  const { services, loading, refetch } = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const columns = [
    { label: "Title", key: "title" },
    { label: "Icon", key: "icon" },
    {
      label: "Description",
      key: "description",
      render: (row) => (
        <span className="line-clamp-2 max-w-xs">{row.description}</span>
      ),
    },
  ];

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditing(item);
      setFormData({
        title: item.title,
        description: item.description,
        icon: item.icon || "HiDesktopComputer",
      });
    } else {
      setEditing(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editing) {
        await updateService(editing.id, formData);
        toast.success("Service updated!");
      } else {
        await addService(formData);
        toast.success("Service added!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteService(deleteId);
      toast.success("Deleted!");
      setDeleteId(null);
      refetch();
    } catch {
      toast.error("Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Manage the services you offer on your portfolio."
        action={
          <Button variant="gradient" onClick={() => handleOpenModal()}>
            Add Service
          </Button>
        }
      />

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : (
        <DataTable columns={columns} data={services} onEdit={handleOpenModal} onDelete={setDeleteId} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={editing ? "Edit Service" : "Add Service"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Input label="Description" type="textarea" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <Select
            label="Icon"
            options={SERVICE_ICON_OPTIONS}
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          />
          <Button variant="gradient" type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Remove this service from your portfolio?"
      />
    </div>
  );
}
