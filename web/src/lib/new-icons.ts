// Icons added in the latest release, for the home strip and the "New" tags on /icons.
// Update at every release (git show --name-only --diff-filter=A <icons commit> -- icons/).
export const NEW_VERSION = "1.4";
export const NEW_ICONS = [
  "activity", "airplay", "antenna", "api", "badge-percent", "bag-plus", "bank", "battery-full", "battery-low", "bot",
  "braces", "brain", "brain-circuit", "brightness-low", "bring-forward", "bring-to-front", "calendar-clock", "calendar-heart", "calendar-range", "calendar-search",
  "caps-lock", "cart-check", "cart-plus", "cart-x", "chart-area", "chart-bar-horizontal", "chart-column", "chart-donut", "chart-scatter", "chat-sparkle",
  "chip-ai", "clipboard-paste", "clock-check", "clock-plus", "contrast", "control", "copy-plus", "coupon", "dark-mode", "delete-left",
  "desktop", "dock", "earbuds", "eject", "ethernet", "euro", "file-sparkle", "file-text-search", "function", "git-branch",
  "git-commit", "git-fork", "git-merge", "git-pull-request", "hand-coins", "handshake", "hard-drive", "hierarchy", "hotspot", "image-sparkle",
  "invoice", "keyboard", "keyboard-light", "list-filter", "monitor-off", "mouse", "mouse-pointer", "network", "night-shift", "option",
  "piggy-bank", "plug-zap", "power", "presentation-chart", "projector", "receipt-percent", "router", "rupee", "screen-mirror", "screenshot",
  "sd-card", "send-backward", "send-to-back", "share-nearby", "share-up", "shift", "shopping-basket", "signal", "signal-low", "signal-medium",
  "sitemap", "smartwatch", "split", "square-pen", "subscript", "superscript", "tag-off", "tags", "text-size", "trackpad",
  "usb", "variable", "volume-none", "wand", "webcam", "webhook", "window-overview", "workflow",
];
export const IS_NEW = new Set(NEW_ICONS);
