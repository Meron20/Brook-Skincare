import {
  Mail,
  MessageCircle,
  Clock,
  Globe,
  Star,
  Stethoscope,
} from "lucide-react";

export const contactItems = [
  {
    icon: <Mail size={24} strokeWidth={1.8} />,
    title: "Email Us",
    text: "hello@brookskincare.com",
    href: "mailto:hello@brookskincare.com",
  },
  {
    icon: <MessageCircle size={24} strokeWidth={1.8} />,
    title: "WhatsApp / DM",
    text: "+46 70 000 0000",
    href: "https://wa.me/46700000000",
    external: true,
  },
  {
    icon: <Clock size={24} strokeWidth={1.8} />,
    title: "Response Time",
    text: "Within 24 hours, Mon–Fri",
    href: "#contact-form",
  },
  {
    icon: <Globe size={24} strokeWidth={1.8} />,
    title: "Online Consultations",
    text: "Available in 50+ countries",
    href: "/login",
  },
];

export const stats = [
  {
    icon: <Globe size={26} strokeWidth={1.8} />,
    value: "50+",
    label: "Countries",
  },
  {
    icon: <Star size={26} strokeWidth={1.8} fill="currentColor" />,
    value: "5.0",
    label: "Rating",
  },
  {
    icon: <Stethoscope size={26} strokeWidth={1.8} />,
    value: "8yr",
    label: "Experience",
  },
];

export const faqs = [
  {
    q: "What is hydration therapy?",
    a: "Hydration therapy is a specialised skincare treatment designed to restore moisture, improve elasticity, and leave your skin glowing and refreshed.",
  },
  {
    q: "Is it suitable for all skin types?",
    a: "Yes. Each consultation is personalised based on your skin type, skin history, lifestyle, and goals.",
  },
  {
    q: "How long does a consultation take?",
    a: "Most consultations take around 30–45 minutes depending on your concerns and the level of guidance you need.",
  },
  {
    q: "What results can I expect?",
    a: "Results vary, but many clients notice improvements in hydration, clarity, texture, and overall skin confidence with consistency.",
  },
];