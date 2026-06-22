/**
 * script.js
 * Two small, purposeful behaviors — no unnecessary animation:
 *  1. Highlights the current section in the top nav as the user scrolls,
 *     reinforcing the "system status" feel of the page.
 *  2. Prints a short status log to the console, in keeping with the
 *     flow-log visual theme — a nod for anyone who opens devtools.
 */

(function () {
  "use strict";

  // --- 1. Active nav section tracking ---------------------------------
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".topbar__nav a");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const linkFor = (id) =>
      document.querySelector(`.topbar__nav a[href="#${id}"]`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkFor(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.removeAttribute("aria-current"));
            link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // --- 2. Console flow log ---------------------------------------------
  const log = [
    "[flow] page_load:start",
    "[flow] assets.fetch -> ok",
    "[flow] schema.render -> ok",
    "[flow] page_load:complete — welcome!",
  ];
  log.forEach((line) => console.log("%c" + line, "color:#d98e3b;font-family:monospace;"));
})();
