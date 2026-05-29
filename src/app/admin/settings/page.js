"use client";
import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { saveSettings, DEFAULT_SETTINGS } from "@/services/settingsService";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";

export default function SettingsAdmin() {
  const { settings, loading, refetch } = useSettings();
  const [formData, setFormData] = useState(DEFAULT_SETTINGS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveSettings(formData);
      toast.success("Site settings saved! Visit your homepage to see changes.");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  if (loading) {
    return <div className="text-center text-gray-400 py-16">Loading settings...</div>;
  }

  return (
    <div>
      <AdminPageHeader
        title="Site Settings"
        description="Update your name, bio, contact details, and social links. These appear on your public portfolio."
      />

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        <GlassCard className="!p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Hero section</h2>
          <Input label="Your Name" value={formData.name} onChange={(e) => update("name", e.target.value)} required />
          <Input label="Availability badge" value={formData.availabilityText} onChange={(e) => update("availabilityText", e.target.value)} placeholder="Available for new opportunities" />
          <Input label="Hero bio" type="textarea" value={formData.heroBio} onChange={(e) => update("heroBio", e.target.value)} required />
          <Input
            label="Rotating roles (comma separated)"
            value={formData.typewriterRoles}
            onChange={(e) => update("typewriterRoles", e.target.value)}
            placeholder="Full-Stack Developer, UI/UX Designer"
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">CV / Resume</label>
            <ImageUploader 
              value={formData.cvUrl} 
              onChange={(url) => update("cvUrl", url)} 
              folder="CV" 
              useLocalStorage={true} 
            />
            <Input 
              label="Or paste CV URL" 
              value={formData.cvUrl} 
              onChange={(e) => update("cvUrl", e.target.value)} 
              placeholder="https://..." 
              className="mt-2"
            />
          </div>
        </GlassCard>

        <GlassCard className="!p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Contact info</h2>
          <Input label="Email" type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} required />
          <Input label="Phone" value={formData.phone} onChange={(e) => update("phone", e.target.value)} />
          <Input label="Location" value={formData.location} onChange={(e) => update("location", e.target.value)} />
        </GlassCard>

        <GlassCard className="!p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Social links</h2>
          <Input label="GitHub URL" value={formData.github} onChange={(e) => update("github", e.target.value)} placeholder="https://github.com/..." />
          <Input label="LinkedIn URL" value={formData.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
          <Input label="Twitter / X URL" value={formData.twitter} onChange={(e) => update("twitter", e.target.value)} />
          <Input label="WhatsApp (full URL or number)" value={formData.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
        </GlassCard>

        <GlassCard className="!p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">About section</h2>
          <Input label="About text" type="textarea" value={formData.aboutText} onChange={(e) => update("aboutText", e.target.value)} />
        </GlassCard>

        <Button variant="gradient" type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Saving..." : "Save all settings"}
        </Button>
      </form>
    </div>
  );
}
