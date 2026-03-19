import type { SVGProps } from "react";

type AuthTab = "login" | "register";

type LoginForm = {
  password: string;
  phone: string;
  remember: boolean;
};

type RegisterForm = {
  agreement: boolean;
  confirmPassword: string;
  password: string;
  phone: string;
};

type FeatureItem = {
  description: string;
  icon: "book" | "comment" | "phone" | "user";
};

type IconProps = SVGProps<SVGSVGElement>;

export type { IconProps, AuthTab, LoginForm, RegisterForm, FeatureItem };