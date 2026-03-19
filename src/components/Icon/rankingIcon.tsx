import type { ReactNode, SVGProps } from "react";
type IconProps = SVGProps<SVGSVGElement>;
export function SvgIcon({
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

export function RobotIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect height="12" rx="3" width="14" x="5" y="7" />
      <path d="M12 3v4" />
      <path d="M9 12h.01" />
      <path d="M15 12h.01" />
      <path d="M9 16h6" />
      <path d="M3 10h2" />
      <path d="M19 10h2" />
    </SvgIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </SvgIcon>
  );
}

export function CrownIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m3 7 4.5 5L12 5l4.5 7L21 7l-2 12H5L3 7Z" />
    </SvgIcon>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M16 6h3a2 2 0 0 1-2 2h-1" />
      <path d="M8 6H5a2 2 0 0 0 2 2h1" />
    </SvgIcon>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </SvgIcon>
  );
}

export function CommentIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z" />
    </SvgIcon>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m12 20-1.2-1.1C5.3 14 2 11 2 7.5A4.5 4.5 0 0 1 6.5 3C8.2 3 9.9 3.8 11 5.1 12.1 3.8 13.8 3 15.5 3A4.5 4.5 0 0 1 20 7.5c0 3.5-3.3 6.5-8.8 11.4L12 20Z" />
    </SvgIcon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m15 18-6-6 6-6" />
    </SvgIcon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m9 18 6-6-6-6" />
    </SvgIcon>
  );
}