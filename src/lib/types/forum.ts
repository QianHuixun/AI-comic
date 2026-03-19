import { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

type NavLink = {
  active?: boolean;
  href: string;
  label: string;
};

type Category = {
  key:
    | "all"
    | "discussion"
    | "feedback"
    | "share"
    | "help"
    | "announcement";
  label: string;
};

type PostStat = {
  icon: "comment" | "eye" | "heart";
  value: string;
};

type ForumPost = {
  author: string;
  category: Category["key"];
  stats: [PostStat, PostStat, PostStat];
  time: string;
  title: string;
};

type ChatMessage = {
  content: string;
  sender: string;
  time: string;
};

type FooterColumn = {
  links: ReadonlyArray<{
    href: string;
    label: string;
  }>;
  title: string;
};

export type { IconProps, NavLink, Category, PostStat, ForumPost, ChatMessage, FooterColumn };