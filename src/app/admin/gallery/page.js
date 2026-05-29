"use client";
import { useState, useEffect } from "react";
import { useGallerys } from "@/hooks/useGallerys";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { addGallery, updateGallery, deleteGallery, syncOfflineQueue } from "@/services/galleryService";
import { offlineStorage } from "@/lib/offlineStorage";
import DataTable from "@/components/admin/DataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";

const CATEGORIES = [
  { value: "Setup", label: "Setup" },
  { value: "Events", label: "Events" },
  { value: "Work", label: "Work" },
  { value: "Personal", label: "Personal" },
];

const emptyForm = { title: "", src: "", category: "Work" };

export default function GalleryAdmin() {
  const { gallerys, loading, refetch } = useGallerys();
  const { isOnline } = useOfflineStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateQueueCount = async () => {
      const queue = await offlineStorage.getUploadQueue();
      setQueueCount(queue.filter((item) => item.status === "pending").length);
    };
    updateQueueCount();
    const interval = setInterval(updateQueueCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    if (!isOnline) {
      toast.error("Cannot sync while offline");
      return;
    }
    setIsSyncing(true);
    try {
      await syncOfflineQueue();
      await offlineStorage.init();
      const queue = await offlineStorage.getUploadQueue();
      setQueueCount(queue.filter((item) => item.status === "pending").length);
      refetch();
      toast.success("Synced successfully!");
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const columns = [
    {
      label: "Preview",
      key: "src",
      render: (row) =>
        row.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.src} alt={row.title} className="w-14 h-14 rounded-lg object-cover" />
        ) : (
          "—"
        ),
    },
    { label: "Title", key: "title" },
    { label: "Category", key: "category" },
  ];

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditing(item);
      setFormData({ title: item.title, src: item.src || "", category: item.category || "Work" });
    } else {
      setEditing(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.src) {
      toast.error("Please upload an image.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = editing
        ? await updateGallery(editing.id, formData)
        : await addGallery(formData);

      if (result.isOffline) {
        toast.success(!isOnline ? "Saved locally! Will sync when online." : "Saved!");
        const queue = await offlineStorage.getUploadQueue();
        setQueueCount(queue.filter((item) => item.status === "pending").length);
      } else {
        toast.success(editing ? "Gallery item updated!" : "Gallery item added!");
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
      await deleteGallery(deleteId);
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
        title="Gallery"
        description="Upload photos for your portfolio gallery section."
        action={
          <div className="flex gap-3">
            {queueCount > 0 && isOnline && (
              <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
                {isSyncing ? "Syncing..." : `Sync ${queueCount} Item${queueCount > 1 ? "s" : ""}`}
              </Button>
            )}
            <Button variant="gradient" onClick={() => handleOpenModal()}>
              Add Photo
            </Button>
          </div>
        }
      />

      {!isOnline && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-3">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <p className="text-yellow-500 text-sm">
            You're offline. Changes will be saved locally and synced when you reconnect.
            {queueCount > 0 && ` (${queueCount} item${queueCount > 1 ? "s" : ""} pending sync)`}
          </p>
        </div>
      )}

      {isOnline && queueCount > 0 && (
        <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <p className="text-cyan-400 text-sm">
              {queueCount} item{queueCount > 1 ? "s" : ""} pending sync
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : (
        <DataTable columns={columns} data={gallerys} onEdit={handleOpenModal} onDelete={setDeleteId} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={editing ? "Edit Photo" : "Add Photo"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Select
            label="Category"
            options={CATEGORIES}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Image</label>
            <ImageUploader value={formData.src} onChange={(url) => setFormData({ ...formData, src: url })} folder="Gallery" useLocalStorage={true} />
          </div>
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
        message="Remove this photo from your gallery?"
      />
    </div>
  );
}
