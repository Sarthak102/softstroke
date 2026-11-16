// Icons added in the latest release, for the home strip and the "New" tags on /icons.
// Update at every release (git show --name-only --diff-filter=A <icons commit> -- icons/).
export const NEW_VERSION = "1.3";
export const NEW_ICONS = [
  "accessibility", "alert-octagon", "badge-alert", "bell-dot", "chat-check", "chat-circle", "chat-dots", "chat-plus", "chats", "clipboard-check",
  "clipboard-list", "clipboard-pen", "contact-book", "eye-closed", "file-archive", "file-audio", "file-code", "file-image", "file-lock", "file-minus",
  "file-pen", "file-search", "file-spreadsheet", "file-video", "file-x", "files", "folder-check", "folder-lock", "folder-minus", "folder-search",
  "folder-x", "headset", "id-badge", "mail-check", "mail-plus", "mail-x", "mails", "password", "person-standing", "phone-incoming",
  "phone-missed", "phone-outgoing", "reply-all", "scan-eye", "scan", "search-check", "search-x", "shield-lock", "shield-plus", "shield-user",
  "shield-x", "user-cog", "user-heart", "user-lock", "user-pen", "user-search", "user-shield", "user-star", "vault", "voicemail",
  "zoom-in", "zoom-out",
];
export const IS_NEW = new Set(NEW_ICONS);
