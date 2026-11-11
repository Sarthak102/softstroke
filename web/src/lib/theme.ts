// Runs before paint (inlined in <head>) so the page never flashes the wrong theme.
// Every visit opens light (Sarthak's call); a switch to dark lasts for this tab's session only.
export const themeScript = `try{document.documentElement.dataset.theme=sessionStorage.getItem("theme")==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;
