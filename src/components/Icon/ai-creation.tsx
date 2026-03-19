import type { IconProps } from "../../lib/types/ai-creation";
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
  
  function SparklesIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
        <path d="m19 14 .7 1.9L21.5 16l-1.8.7L19 18.5l-.7-1.8-1.8-.7 1.8-.1L19 14Z" />
        <path d="m5 15 .9 2.4L8.3 18l-2.4.9L5 21.3l-.9-2.4L1.7 18l2.4-.6L5 15Z" />
      </SvgIcon>
    );
  }
  
  function GridIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <rect height="7" rx="1.5" width="7" x="3" y="3" />
        <rect height="7" rx="1.5" width="7" x="14" y="3" />
        <rect height="7" rx="1.5" width="7" x="3" y="14" />
        <rect height="7" rx="1.5" width="7" x="14" y="14" />
      </SvgIcon>
    );
  }
  
  function HistoryIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
        <path d="M12 7v5l3 2" />
      </SvgIcon>
    );
  }
  
  function ImageIcon(props: IconProps) {
    return (
      <SvgIcon {...props}>
        <rect height="16" rx="2" width="20" x="2" y="4" />
        <circle cx="8.5" cy="10" r="1.5" />
        <path d="m21 15-5-5L5 21" />
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
        <path d="m12 3 2.8 5.7L21 9.6l-4.5 4.4 1 6.2L12 17.2l-5.5 3 1-6.2L3 9.6l6.2-.9L12 3Z" />
      </SvgIcon>
    );
  }
  
  function HeartIcon(props: IconProps & { filled?: boolean }) {
    const { filled = false, ...rest } = props;
  
    return (
      <svg
        aria-hidden="true"
        className={rest.className}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="m12 20-1.2-1.1C5.3 14 2 11 2 7.5A4.5 4.5 0 0 1 6.5 3C8.2 3 9.9 3.8 11 5.1 12.1 3.8 13.8 3 15.5 3A4.5 4.5 0 0 1 20 7.5c0 3.5-3.3 6.5-8.8 11.4L12 20Z" />
      </svg>
    );
  }
export { PencilIcon, SearchIcon, SparklesIcon, GridIcon, HistoryIcon, ImageIcon, EyeIcon, StarIcon, HeartIcon };