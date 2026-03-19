import type { IconProps } from "../../lib/types/edit-profile";
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
  
  function PencilIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
      </IconBase>
    );
  }
  
  function SearchIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </IconBase>
    );
  }
  
  function EditIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <path d="m4 20 4.5-1 9-9a2.12 2.12 0 0 0-3-3l-9 9L4 20Z" />
        <path d="M13.5 6.5 17 10" />
      </IconBase>
    );
  }
  
  function ArrowLeftIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
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
  
  function CameraIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <path d="M4 8h3l2-3h6l2 3h3v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <circle cx="12" cy="13" r="3" />
      </IconBase>
    );
  }
  
  function MailIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <rect height="14" rx="2" width="18" x="3" y="5" />
        <path d="m4 7 8 6 8-6" />
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
  
  function InfoIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </IconBase>
    );
  }
  
  function SaveIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <path d="M5 21h14a1 1 0 0 0 1-1V7.4a1 1 0 0 0-.3-.7l-2.4-2.4a1 1 0 0 0-.7-.3H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        <path d="M17 21v-8H7v8" />
        <path d="M7 4v5h8" />
      </IconBase>
    );
  }
  
  function CloseIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </IconBase>
    );
  }
  
  function CheckCircleIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.5 2.5 5-5" />
      </IconBase>
    );
  }
  
export {PencilIcon, SearchIcon, EditIcon, ArrowLeftIcon, UserIcon, CameraIcon, MailIcon, PhoneIcon, InfoIcon, SaveIcon, CloseIcon, CheckCircleIcon}