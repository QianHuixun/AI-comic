import type { IconProps } from "../../lib/types/login";
import type { ReactNode } from "react";

function IconBase({
    children,
    className,
    viewBox = "0 0 24 24",
    ...props
  }: IconProps & { children: ReactNode }) {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox={viewBox}
        {...props}
      >
        {children}
      </svg>
    );
  }
  
  function BookIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" />
      </IconBase>
    );
  }
  
  function PhoneIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6.3 6.3l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6A2 2 0 0 1 22 16.9Z" />
      </IconBase>
    );
  }
  
  function UserIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20a8 8 0 0 1 16 0" />
      </IconBase>
    );
  }
  
  function MessageIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <path d="M7 10h10" />
        <path d="M7 14h6" />
        <path d="M21 12a8 8 0 0 1-8 8H5l-3 3V12a8 8 0 0 1 8-8h3a8 8 0 0 1 8 8Z" />
      </IconBase>
    );
  }
  export { BookIcon, PhoneIcon, UserIcon, MessageIcon };