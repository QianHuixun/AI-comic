import type { SVGProps } from "react";

type NavLinkItem = {
    active?: boolean;
    href: string;
    label: string;
  };
  
  type FooterColumn = {
    links: Array<{ href: string; label: string }>;
    title: string;
  };
  
  type FormValues = {
    bio: string;
    email: string;
    phone: string;
    username: string;
  };
  
  type FormErrorKey = keyof FormValues | "avatar";
  
  type FormErrors = Partial<Record<FormErrorKey, string>>;
  
  type IconProps = SVGProps<SVGSVGElement>;

  export type { NavLinkItem, FooterColumn, FormValues, FormErrorKey, FormErrors, IconProps };