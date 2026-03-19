import type { SVGProps } from "react";

type TabKey = "comics" | "templates";

type NavLinkItem = {
  active?: boolean;
  href: string;
  label: string;
};

type ProfileStat = {
  label: string;
  value: string;
};

type ComicItem = {
  category: string;
  cover: string;
  id: string;
  title: string;
  views: string;
};

type TemplateItem = {
  cover: string;
  id: string;
  name: string;
  rating: string;
  views: string;
};

type FooterColumn = {
  links: Array<{ href: string; label: string }>;
  title: string;
};

type IconProps = SVGProps<SVGSVGElement>;

export type { IconProps, TabKey, NavLinkItem, ProfileStat, ComicItem, TemplateItem, FooterColumn };