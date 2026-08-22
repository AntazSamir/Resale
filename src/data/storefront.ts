export interface StoreSocialLinks {
  facebook?: string | undefined;
  website?: string | undefined;
  whatsapp?: string | undefined;
  instagram?: string | undefined;
}

export interface Storefront {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  tagline?: string | undefined;
  description?: string | undefined;
  logoUrl?: string | undefined;
  bannerUrl?: string | undefined;
  district: string;
  area?: string | undefined;
  address?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  businessHours?: string | undefined;
  returnPolicy?: string | undefined;
  warrantyPolicy?: string | undefined;
  verified: boolean;
  socialLinks?: StoreSocialLinks | undefined;
  rating: number;
  totalSales: number;
  isDemo?: boolean | undefined;
  createdAt: string;
}

export const INITIAL_DEMO_STORES: Storefront[] = [
  {
    id: "store-apple-vault",
    ownerId: "seller-rafiq-1",
    name: "Apple Vault Banani",
    slug: "apple-vault",
    tagline: "Dhaka's Premier Graded Apple & Premium Tech Outlet",
    description:
      "Physical retail merchant located in Banani Road 11. Specializing in verified Grade A & A+ Apple MacBooks, iPhones, and camera systems. All units pass 32-point diagnostics with physical receipt and shop warranty.",
    logoUrl:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=160&auto=format&fit=crop&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80",
    district: "Dhaka",
    area: "Banani",
    address: "House 42, Road 11, Block D, Banani, Dhaka 1213",
    phone: "+880 1711-234567",
    email: "contact@applevault.bd",
    businessHours: "Saturday – Thursday: 10:30 AM – 8:30 PM",
    returnPolicy:
      "48-hour standard Resale buyer protection applies. Full refund or exchange available if diagnostic specs do not match.",
    warrantyPolicy:
      "30-day in-house replacement warranty on logic board & display for Grade A+ devices in addition to platform protection.",
    verified: true,
    socialLinks: {
      facebook: "https://facebook.com/applevaultbd",
      whatsapp: "+8801711234567",
    },
    rating: 4.9,
    totalSales: 84,
    isDemo: true,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "store-pixel-hub",
    ownerId: "seller-tanvir-2",
    name: "Pixel & Gadget Hub",
    slug: "pixel-gadget-hub",
    tagline: "Certified Pre-Owned Pixel, Sony & Audio Gear",
    description:
      "Authorized second-life electronics merchant in Multiplan Center. Hand-tested Google Pixel flagships, Sony Alpha bodies, and audiophile headphones with authentic condition disclosures.",
    logoUrl:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=160&auto=format&fit=crop&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80",
    district: "Dhaka",
    area: "Elephant Road",
    address: "Shop 408, Level 4, Multiplan Center, Elephant Road, Dhaka 1205",
    phone: "+880 1822-987654",
    email: "sales@pixelhub.com.bd",
    businessHours: "Sunday – Friday: 11:00 AM – 9:00 PM (Closed Tuesday)",
    returnPolicy: "48-hour return window for undisclosed physical or functional faults.",
    warrantyPolicy: "7-day servicing warranty on camera sensors and audio drivers.",
    verified: true,
    socialLinks: {
      facebook: "https://facebook.com/pixelhubbd",
      whatsapp: "+8801822987654",
    },
    rating: 4.8,
    totalSales: 62,
    isDemo: true,
    createdAt: "2026-02-01T12:00:00Z",
  },
];
