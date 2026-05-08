const modules = {
  detection: {
    title: "Flood Detection",
    state: "Active",
    image: "assets/project overview/flood detector.png",
    alt: "AFPS flood detector prototype with water-level electronics",
    description: "Monitors water levels continuously for early flood warnings and faster emergency response.",
    specs: [
      ["Signal", "Water level"],
      ["Output", "Early warning"],
      ["Role", "Preparedness"]
    ]
  },
  barrier: {
    title: "Barrier System",
    state: "Ready",
    image: "assets/project overview/prevention.jpeg",
    alt: "AFPS automated flood prevention barrier prototype",
    description: "Deploys an automatic barrier to reduce flood impact and protect nearby infrastructure.",
    specs: [
      ["Trigger", "Rising water"],
      ["Output", "Barrier motion"],
      ["Role", "Impact reduction"]
    ]
  },
  debris: {
    title: "Debris Collection",
    state: "Operational",
    image: "assets/project overview/debris collector.png",
    alt: "AFPS debris collector prototype",
    description: "Collects floating waste to protect drainage flow and reduce pollution entering waterways.",
    specs: [
      ["Target", "Floating waste"],
      ["Output", "Collected debris"],
      ["Role", "Remote checking"]
    ]
  },
  dashboard: {
    title: "IoT Dashboard",
    state: "Online",
    image: "assets/project overview/iot dashboard.png",
    alt: "AFPS IoT dashboard screenshot",
    description: "Displays real-time system and environmental data for remote monitoring and faster decisions.",
    specs: [
      ["Data", "Water and trash levels"],
      ["Output", "Live dashboard"],
      ["Role", "Decision support"]
    ]
  }
};

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const moduleButtons = Array.from(document.querySelectorAll("[data-module]"));
const moduleImage = document.querySelector("#module-image");
const moduleTitle = document.querySelector("#module-title");
const moduleState = document.querySelector("#module-state");
const moduleDescription = document.querySelector("#module-description");
const moduleSpecs = document.querySelector("#module-specs");
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const videoPreview = document.querySelector("[data-video-preview]");
const playVideoButton = document.querySelector("[data-play-video]");
const openVideoLink = document.querySelector("[data-open-video]");
const envStatus = document.querySelector("[data-env-status]");

let activeVideo = null;

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 12);
}

function closeMobileNav() {
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

function initNavigation() {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  }, {
    rootMargin: "-42% 0px -52% 0px",
    threshold: 0
  });

  ["system", "features", "impact", "team", "video"].forEach((id) => {
    const section = document.getElementById(id);
    if (section) navObserver.observe(section);
  });
}

function initReveal() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14
  });

  revealItems.forEach((item) => revealObserver.observe(item));
}

function renderModule(key) {
  const data = modules[key];
  if (!data) return;

  moduleButtons.forEach((button) => {
    const active = button.dataset.module === key;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  moduleImage.src = data.image;
  moduleImage.alt = data.alt;
  moduleTitle.textContent = data.title;
  moduleState.textContent = data.state;
  moduleDescription.textContent = data.description;
  moduleSpecs.innerHTML = data.specs
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");
}

function initModules() {
  moduleButtons.forEach((button) => {
    button.addEventListener("click", () => renderModule(button.dataset.module));
  });
}

function parseEnv(text) {
  return text.split(/\r?\n/).reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return acc;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) return acc;
    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    acc[key] = value;
    return acc;
  }, {});
}

function getYouTubeId(input) {
  if (!input) return null;
  const value = input.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] || null;
    }
    if (url.searchParams.has("v")) {
      return url.searchParams.get("v");
    }
    const parts = url.pathname.split("/").filter(Boolean);
    const marker = parts.findIndex((part) => ["embed", "shorts", "live"].includes(part));
    if (marker !== -1 && parts[marker + 1]) {
      return parts[marker + 1];
    }
  } catch {
    return null;
  }

  return null;
}

function setVideoDisabled(message) {
  activeVideo = null;
  playVideoButton.disabled = true;
  openVideoLink.href = "#";
  openVideoLink.classList.add("disabled");
  openVideoLink.setAttribute("aria-disabled", "true");
  videoPreview.innerHTML = `
    <div class="video-placeholder">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>
      <p>${message}</p>
    </div>
  `;
  envStatus.innerHTML = `Set <code>YOUTUBE_URL</code> in <code>.env</code> to show your project pitch preview.`;
}

function setVideoEnabled(videoUrl, videoId) {
  activeVideo = {
    url: videoUrl,
    id: videoId,
    embed: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
    thumb: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  };

  videoPreview.innerHTML = `
    <img src="${activeVideo.thumb}" alt="YouTube pitch video thumbnail" data-video-thumb>
  `;

  const thumb = videoPreview.querySelector("[data-video-thumb]");
  thumb.addEventListener("error", () => {
    thumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }, { once: true });

  playVideoButton.disabled = false;
  openVideoLink.href = videoUrl;
  openVideoLink.classList.remove("disabled");
  openVideoLink.setAttribute("aria-disabled", "false");
  envStatus.innerHTML = `Video configured from <code>.env</code>. Use a public or unlisted YouTube link for competition submission.`;
}

async function loadVideoFromEnv() {
  try {
    const response = await fetch(".env", { cache: "no-store" });
    if (!response.ok) {
      setVideoDisabled("No .env file found on this server.");
      return;
    }
    const env = parseEnv(await response.text());
    const videoUrl = env.YOUTUBE_URL || env.VITE_YOUTUBE_URL || env.NEXT_PUBLIC_YOUTUBE_URL || "";
    const videoId = getYouTubeId(videoUrl);

    if (!videoUrl) {
      setVideoDisabled("YOUTUBE_URL is empty.");
      return;
    }

    if (!videoId) {
      setVideoDisabled("YOUTUBE_URL is not a valid YouTube link.");
      return;
    }

    setVideoEnabled(videoUrl, videoId);
  } catch {
    setVideoDisabled("Run the website through a local server so JavaScript can read .env.");
  }
}

function initVideo() {
  playVideoButton.addEventListener("click", () => {
    if (!activeVideo) return;
    videoPreview.innerHTML = `
      <iframe
        src="${activeVideo.embed}"
        title="AFPS YouTube pitch video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    `;
  });
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();
initNavigation();
initReveal();
initModules();
initVideo();
loadVideoFromEnv();
