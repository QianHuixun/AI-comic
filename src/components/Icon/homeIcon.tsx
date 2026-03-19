import { SvgIcon } from "./rankingIcon";

function ChevronDownIcon({ className = "" }: { className?: string }) {
    return (
      <SvgIcon className={className}>
        <path d="m6 9 6 6 6-6" />
      </SvgIcon>
    );
  }
  
  function UserIcon({ className = "" }: { className?: string }) {
    return (
      <SvgIcon className={className}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20a8 8 0 0 1 16 0" />
      </SvgIcon>
    );
  }
  
  function SettingsIcon({ className = "" }: { className?: string }) {
    return (
      <SvgIcon className={className}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.7-.9 1 1 0 0 0-1 .2l-.2.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1l-.1-.2a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .7.9 1 1 0 0 0 1-.2l.2-.1a2 2 0 0 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6Z" />
      </SvgIcon>
    );
  }
  
  function LogOutIcon({ className = "" }: { className?: string }) {
    return (
      <SvgIcon className={className}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </SvgIcon>
    );
  }
  
  function StarIcon({ className = "" }: { className?: string }) {
    return (
      <SvgIcon className={className}>
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />
      </SvgIcon>
    );
  }
  
  function FireIcon({ className = "" }: { className?: string }) {
    return (
      <SvgIcon className={className}>
        <path d="M12 3c1 3-1 4.5-2.7 6.2C7.7 10.8 7 12.2 7 14a5 5 0 0 0 10 0c0-2.2-1-3.7-2.6-5.4C13 7.2 11.8 5.8 12 3Z" />
        <path d="M12 12c.6 1.2-.2 1.9-.9 2.6-.5.5-.8 1-.8 1.7a1.7 1.7 0 1 0 3.4 0c0-.8-.4-1.4-.9-1.9-.6-.6-1.1-1.2-.8-2.4Z" />
      </SvgIcon>
    );
  }

export { ChevronDownIcon, UserIcon, SettingsIcon, LogOutIcon, StarIcon, FireIcon };