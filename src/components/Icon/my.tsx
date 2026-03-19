import type { IconProps } from "../../lib/types/my";
import type { ReactNode } from "react";

function SvgIcon({
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
        strokeWidth="2"
        viewBox={viewBox}
        {...props}
      >
        {children}
      </svg>
    );
  }
  
  function PencilIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </SvgIcon>
    );
  }
  
  function SearchIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </SvgIcon>
    );
  }
  
  function UserIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="M20 21a8 8 0 1 0-16 0" />
        <circle cx="12" cy="8" r="4" />
      </SvgIcon>
    );
  }
  
  function HeartIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="m12 20-1.2-1.1C5.3 14 2 11 2 7.5A4.5 4.5 0 0 1 6.5 3C8.2 3 9.9 3.8 11 5.1 12.1 3.8 13.8 3 15.5 3A4.5 4.5 0 0 1 20 7.5c0 3.5-3.3 6.5-8.8 11.4L12 20Z" />
      </SvgIcon>
    );
  }
  
  function EyeIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </SvgIcon>
    );
  }
  
  function StarIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9Z" />
      </SvgIcon>
    );
  }
export { PencilIcon, SearchIcon, UserIcon, HeartIcon, EyeIcon, StarIcon };