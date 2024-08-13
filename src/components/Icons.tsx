import { Icon, IconProps } from '@chakra-ui/react';

export function PlusIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </Icon>
  );
}

export function StickyNoteIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" fill="none" stroke="#d5b990" width="24px" height="24px" {...props}>
      <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
      <path d="M15 3v4a2 2 0 0 0 2 2h4" />
    </Icon>
  );
}

export function FilePenIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" fill="none" stroke="#6b4206" width="16px" height="16px" {...props}>
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </Icon>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" fill="none" stroke="#6b4206" width="16px" height="16px" {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </Icon>
  );
}
