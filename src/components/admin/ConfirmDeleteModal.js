"use client";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete item?",
  message = "This action cannot be undone.",
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-400 mb-6">{message}</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="gradient"
          onClick={onConfirm}
          className="flex-1 !bg-red-500/20 !border-red-500/30 hover:!bg-red-500/30"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}
