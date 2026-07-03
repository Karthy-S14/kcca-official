export const SITE = {
  name: "KCCA",
  fullName: "Kilinochchi Central Chess Association",
  tagline: "Building Future Chess Champions",
  founded: "2026",
  phone: "+94 77 91 08 186",
  phoneDial: "+94779108186",
  whatsapp: "94779108186",
  email: "kcca.chess.lk@gmail.com",
  address: "Kilinochchi Central College, Kilinochchi, Sri Lanka",
  mapQuery: "Kilinochchi Central College",
} as const;

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/vision-mission", label: "Vision & Mission" },
  { to: "/tournament", label: "Tournament" },
  { to: "/achievements", label: "Achievements" },
  { to: "/rated-players", label: "Rated Players" },
  { to: "/members", label: "Members" },
  { to: "/committee", label: "Committee" },
  { to: "/training", label: "Training" },
  { to: "/gallery", label: "Gallery" },
  { to: "/downloads", label: "Downloads" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export const ADMIN_RESOURCES = [
  { slug: "members", label: "Members", table: "members" },
  { slug: "rated-players", label: "Rated Players", table: "rated_players" },
  { slug: "tournaments", label: "Tournaments", table: "tournaments" },
  { slug: "achievements", label: "Achievements", table: "achievements" },
  { slug: "committee", label: "Committee", table: "committee" },
  { slug: "training", label: "Training", table: "training" },
  { slug: "gallery", label: "Gallery", table: "gallery" },
  { slug: "downloads", label: "Downloads", table: "downloads" },
  { slug: "news", label: "News", table: "news" },
  { slug: "contacts", label: "Contact Messages", table: "contacts" },
] as const;