import {
  HiDesktopComputer,
  HiColorSwatch,
  HiDatabase,
  HiDeviceMobile,
  HiOutlineCode,
  HiOutlineSparkles,
  HiOutlineBriefcase,
  HiOutlinePhotograph,
  HiOutlineLightningBolt,
  HiOutlineGlobe,
} from "react-icons/hi";

export const SERVICE_ICON_OPTIONS = [
  { value: "HiDesktopComputer", label: "Computer / Web" },
  { value: "HiColorSwatch", label: "Design / UI" },
  { value: "HiDatabase", label: "Database / Backend" },
  { value: "HiDeviceMobile", label: "Mobile" },
  { value: "HiOutlineCode", label: "Code" },
  { value: "HiOutlineSparkles", label: "Sparkles" },
  { value: "HiOutlineBriefcase", label: "Business" },
  { value: "HiOutlinePhotograph", label: "Photo" },
  { value: "HiOutlineLightningBolt", label: "Performance" },
  { value: "HiOutlineGlobe", label: "Globe" },
];

export const SERVICE_ICON_MAP = {
  HiDesktopComputer,
  HiColorSwatch,
  HiDatabase,
  HiDeviceMobile,
  HiOutlineCode,
  HiOutlineSparkles,
  HiOutlineBriefcase,
  HiOutlinePhotograph,
  HiOutlineLightningBolt,
  HiOutlineGlobe,
};

export function getServiceIcon(iconName) {
  return SERVICE_ICON_MAP[iconName] || HiDesktopComputer;
}
