/**
 * script.js — Arabelah May Ancheta Portfolio v2
 * 1. Scroll-reveal  2. Active nav  3. Lightbox
 * 4. Mobile nav  5. Supabase guestbook  6. Console log
 */
(function () {
  "use strict";

  // 0. Parallax depth for the floating 3D database background
  const cubeWraps = document.querySelectorAll(".db-cube-wrap");
  if (cubeWraps.length && window.matchMedia("(pointer: fine)").matches) {
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    window.addEventListener("mousemove", (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    function tick() {
      curX += (targetX - curX) * 0.04;
      curY += (targetY - curY) * 0.04;
      cubeWraps.forEach((wrap, i) => {
        const depth = (i + 1) * 5;
        wrap.style.transform = "translate3d(" + (curX * depth) + "px," + (curY * depth) + "px,0)";
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  // 1. Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); ro.unobserve(e.target); } });
    }, { threshold: 0.08 });
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // 2. Active nav
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".topbar__nav a");
  if (sections.length && "IntersectionObserver" in window) {
    const no = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector('.topbar__nav a[href="#' + entry.target.id + '"]');
        if (link && entry.isIntersecting) { navLinks.forEach((l) => l.removeAttribute("aria-current")); link.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    sections.forEach((s) => no.observe(s));
  }

  // 3. Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  if (lightbox) {
    document.querySelectorAll(".shot-thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        lightboxImg.src = thumb.getAttribute("data-full");
        lightboxImg.alt = thumb.querySelector("img")?.getAttribute("alt") || "";
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });
    const closeLb = () => { lightbox.hidden = true; lightboxImg.src = ""; document.body.style.overflow = ""; };
    lightboxClose.addEventListener("click", closeLb);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) closeLb(); });
  }

  // 4. Mobile nav
  const menuToggle = document.getElementById("menuToggle");
  const topbarNav = document.querySelector(".topbar__nav");
  if (menuToggle && topbarNav) {
    menuToggle.addEventListener("click", () => topbarNav.classList.toggle("open"));
    topbarNav.querySelectorAll("a").forEach((l) => l.addEventListener("click", () => topbarNav.classList.remove("open")));
  }

  // 5. Supabase Guestbook
  // SETUP INSTRUCTIONS:
  // 1. Create free account at https://supabase.com
  // 2. Create project, then run this SQL:
  //    create table guestbook_entries (
  //      id bigserial primary key,
  //      name text not null,
  //      message text not null,
  //      created_at timestamptz default now()
  //    );
  //    alter table guestbook_entries enable row level security;
  //    create policy "read all" on guestbook_entries for select using (true);
  //    create policy "insert all" on guestbook_entries for insert with check (true);
  // 3. Go to Settings > API, copy your URL and anon key, paste below.
  var SUPABASE_URL = "https://smdvtsyigtcanemwgdxk.supabase.co";
  var SUPABASE_KEY = "sb_publishable_bK7N3WVAVwXUTJ4Z5K789Q_mgte6Eh9";

  var gbSubmit  = document.getElementById("gbSubmit");
  var gbName    = document.getElementById("gb-name");
  var gbMsg     = document.getElementById("gb-msg");
  var gbStatus  = document.getElementById("gbStatus");
  var gbEntries = document.getElementById("gbEntries");
  var gbLoading = document.getElementById("gbLoading");

  var supabaseReady = SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_KEY !== "YOUR_SUPABASE_ANON_KEY";

  function esc(str) {
    return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function timeAgo(dateStr) {
    var diff = Date.now() - new Date(dateStr).getTime();
    var mins = Math.floor(diff / 60000);
    var hours = Math.floor(diff / 3600000);
    var days = Math.floor(diff / 86400000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    if (hours < 24) return hours + "h ago";
    return days + "d ago";
  }

  function renderEntry(entry) {
    var initial = (entry.name || "?")[0].toUpperCase();
    var div = document.createElement("div");
    div.className = "gb-entry";
    div.innerHTML = '<div class="gb-entry__avatar">' + initial + '</div>' +
      '<div><p class="gb-entry__name">' + esc(entry.name) + '</p>' +
      '<p class="gb-entry__msg">' + esc(entry.message) + '</p></div>' +
      '<span class="gb-entry__ts">' + timeAgo(entry.created_at) + '</span>';
    return div;
  }

  function loadEntries() {
    if (!supabaseReady) {
      gbLoading.textContent = "// guestbook not yet connected — add your Supabase credentials to script.js";
      return;
    }
    fetch(SUPABASE_URL + "/rest/v1/guestbook_entries?order=created_at.desc&limit=30", {
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY }
    }).then(function(res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    }).then(function(data) {
      if (gbLoading) gbLoading.remove();
      if (data.length === 0) {
        var empty = document.createElement("p");
        empty.className = "gb-loading";
        empty.textContent = "// no entries yet — be the first to sign!";
        gbEntries.appendChild(empty);
      } else {
        data.forEach(function(entry) { gbEntries.appendChild(renderEntry(entry)); });
      }
    }).catch(function(err) {
      gbLoading.textContent = "// error loading entries: " + err.message;
    });
  }

  if (gbSubmit) {
    gbSubmit.addEventListener("click", function() {
      var name = gbName.value.trim();
      var message = gbMsg.value.trim();
      if (!name || !message) {
        gbStatus.textContent = "// name and message are required";
        gbStatus.className = "gb-status error";
        return;
      }
      if (!supabaseReady) {
        gbStatus.textContent = "// guestbook not yet connected — check script.js";
        gbStatus.className = "gb-status error";
        return;
      }
      gbSubmit.disabled = true;
      gbStatus.textContent = "// submitting...";
      gbStatus.className = "gb-status";
      fetch(SUPABASE_URL + "/rest/v1/guestbook_entries", {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify({ name: name, message: message })
      }).then(function(res) {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      }).then(function(data) {
        var newEntry = data[0];
        gbStatus.textContent = "// entry saved checkmark";
        gbName.value = "";
        gbMsg.value = "";
        var card = renderEntry(newEntry);
        gbEntries.prepend(card);
        var emptyMsg = gbEntries.querySelector(".gb-loading");
        if (emptyMsg) emptyMsg.remove();
      }).catch(function(err) {
        gbStatus.textContent = "// error: " + err.message;
        gbStatus.className = "gb-status error";
      }).finally(function() {
        gbSubmit.disabled = false;
      });
    });
  }

  loadEntries();

  // 6. Console log
  ["[flow] page_load:start","[flow] assets.fetch ok","[flow] schema.render ok","[flow] guestbook.init ok","[flow] page_load:complete"].forEach(function(line) {
    console.log("%c" + line, "color:#d98e3b;font-family:monospace;");
  });

})();
