import type { SVGProps } from "react";

type SettingsTab = "account" | "ai";
type ModelKey = "v1" | "v2";

type NavLinkItem = {
  href: string;
  label: string;
};

type FooterColumn = {
  links: Array<{ href: string; label: string }>;
  title: string;
};

type AccountForm = {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
  phone: string;
};

type AiState = {
  autoSave: boolean;
  enableHistory: boolean;
  selectedModel: ModelKey;
  v1Creativity: string;
  v1Quality: string;
  v2Creativity: string;
  v2Quality: string;
  v2Speed: string;
};

type IconProps = SVGProps<SVGSVGElement>;

export type { IconProps, SettingsTab, NavLinkItem, FooterColumn, AccountForm, AiState };