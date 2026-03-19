import type { IconProps } from "../../lib/types/forum";
import type { ReactNode } from "react";

function SvgIcon({
    children,
    className = "",
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
        <path d="m12 20 7-7" />
        <path d="M18 13a2.8 2.8 0 1 0-4-4L5 18l-1 5 5-1Z" />
        <path d="m15 6 4 4" />
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
  
  function CommentsIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z" />
        <path d="M8 8h8" />
        <path d="M8 12h5" />
      </SvgIcon>
    );
  }
  
  function PlusIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
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
  
  function CommentIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z" />
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
  
  function UserIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </SvgIcon>
    );
  }
  
  function ChevronLeftIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="m15 18-6-6 6-6" />
      </SvgIcon>
    );
  }
  
  function ChevronRightIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="m9 18 6-6-6-6" />
      </SvgIcon>
    );
  }

  export { PencilIcon, SearchIcon, CommentsIcon, PlusIcon, EyeIcon, CommentIcon, HeartIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon };