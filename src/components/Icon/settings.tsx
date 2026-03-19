import type { IconProps } from "../../lib/types/settings";
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
  
  function CogIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c0 .7.4 1.4 1.1 1.6H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1.1Z" />
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
  
  function RobotIcon(props: IconProps) {
    return (
      <IconBase {...props}>
        <rect height="10" rx="2" width="14" x="5" y="9" />
        <path d="M12 5v4" />
        <path d="M8 3h8" />
        <circle cx="10" cy="13" r="1" />
        <circle cx="14" cy="13" r="1" />
        <path d="M9 17h6" />
      </IconBase>
    );
  }

  export {IconBase, PencilIcon, SearchIcon, CogIcon, UserIcon, RobotIcon};