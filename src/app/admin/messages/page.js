"use client";
import { useState, useMemo } from "react";
import { useMessages } from "@/hooks/useMessages";
import { updateMessage, deleteMessage } from "@/services/messageService";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import toast from "react-hot-toast";
import { HiOutlineCheck, HiOutlineMail, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleString();
}

export default function MessagesAdmin() {
  const { messages, loading, refetch } = useMessages();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "unread") return messages.filter((m) => !m.read);
    if (filter === "read") return messages.filter((m) => m.read);
    return messages;
  }, [messages, filter]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleMarkAsRead = async (msg, read) => {
    try {
      await updateMessage(msg.id, { read });
      toast.success(read ? "Marked as read" : "Marked as unread");
      refetch();
      if (selected?.id === msg.id) setSelected({ ...msg, read });
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteMessage(deleteId);
      toast.success("Message deleted");
      if (selected?.id === deleteId) setSelected(null);
      setDeleteId(null);
      refetch();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        description={`${unreadCount} unread of ${messages.length} total`}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all", label: `All (${messages.length})` },
          { key: "unread", label: `Unread (${unreadCount})` },
          { key: "read", label: `Read (${messages.length - unreadCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-gray-400 hover:bg-white/5 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading messages...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white/[0.02] rounded-xl border border-white/5">
          No messages in this view.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <GlassCard
              key={msg.id}
              className={`!p-4 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:border-white/20 transition-colors ${
                !msg.read ? "border-cyan-500/30" : ""
              }`}
              onClick={() => setSelected(msg)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  <h3 className={`font-semibold truncate ${!msg.read ? "text-white" : "text-gray-300"}`}>
                    {msg.subject}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {msg.name} &lt;{msg.email}&gt;
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-500 hidden sm:block">{formatDate(msg.createdAt)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(msg, !msg.read);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    msg.read ? "text-gray-500 hover:text-white" : "text-cyan-400 bg-cyan-400/10"
                  }`}
                  title={msg.read ? "Mark unread" : "Mark read"}
                >
                  {msg.read ? <HiOutlineCheck size={18} /> : <HiOutlineMail size={18} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(msg);
                  }}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                  title="View"
                >
                  <HiOutlineEye size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(msg.id);
                  }}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-400/10"
                  title="Delete"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.subject || "Message"}>
        {selected && (
          <div className="space-y-4">
            <div className="text-sm text-gray-400 space-y-1">
              <p><span className="text-gray-500">From:</span> {selected.name}</p>
              <p><span className="text-gray-500">Email:</span>{" "}
                <a href={`mailto:${selected.email}`} className="text-cyan-400 hover:underline">{selected.email}</a>
              </p>
              <p><span className="text-gray-500">Date:</span> {formatDate(selected.createdAt)}</p>
            </div>
            <div className="p-4 bg-black/30 rounded-xl">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => handleMarkAsRead(selected, !selected.read)} className="flex-1">
                {selected.read ? "Mark unread" : "Mark as read"}
              </Button>
              <Button variant="outline" onClick={() => { setDeleteId(selected.id); setSelected(null); }} className="flex-1 !text-red-400 !border-red-500/30">
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Delete this message permanently?"
      />
    </div>
  );
}
