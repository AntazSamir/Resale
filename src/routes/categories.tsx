import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Smartphone,
  Laptop,
  Camera,
  Tablet,
  Headphones,
  Gamepad2,
  Watch,
  Layers,
  Sparkles,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { products } from "@/data/catalog";

const categories = [
  { id: "Smartphones", label: "Smartphones", icon: Smartphone },
  { id: "Laptops", label: "Laptops", icon: Laptop },
  { id: "Cameras", label: "Cameras", icon: Camera },
  { id: "Tablets", label: "Tablets", icon: Tablet },
  { id: "Audio", label: "Audio", icon: Headphones },
  { id: "Gaming Consoles", label: "Gaming", icon: Gamepad2 },
  { id: "Smartwatches", label: "Watches", icon: Watch },
  { id: "Accessories", label: "Accessories", icon: Layers },
  { id: "Essentials", label: "Essentials", icon: Sparkles },
];

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Categories — Resale" },
      {
        name: "description",
        content:
          "Browse all device categories on Resale — verified second-hand smartphones, laptops, cameras, tablets, audio, gaming consoles, smartwatches and accessories.",
      },
    ],
  }),
});
