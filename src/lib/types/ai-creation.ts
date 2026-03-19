import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

type NavLink = {
  active?: boolean;
  href: string;
  label: string;
};

type InputTabKey = "manual" | "upload" | "crawl";
type TemplateTabKey = "hot" | "new" | "favorites";
type SizeKey = "landscape" | "portrait";

type InputTab = {
  key: InputTabKey;
  label: string;
};

type TemplateTab = {
  key: TemplateTabKey;
  label: string;
};

type StyleOption = {
  label: string;
  value: string;
};

type TemplateCard = {
  id: number;
  image: string;
  name: string;
  rating: string;
  views: string;
};

type HistoryItem = {
  id: number;
  image: string;
  style: string;
  title: string;
};

type FooterColumn = {
  links: ReadonlyArray<{
    href: string;
    label: string;
  }>;
  title: string;
};

export type { IconProps, NavLink, InputTabKey, TemplateTabKey, SizeKey, InputTab, TemplateTab, StyleOption, TemplateCard, HistoryItem, FooterColumn };