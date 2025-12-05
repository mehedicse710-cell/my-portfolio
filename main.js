async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) {
    console.error("Failed to load:", path);
    return null;
  }
  return await res.json();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.textContent = value;
}

function navSetup() {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 80;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navAnchors.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  });
}

async function init() {
  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  navSetup();

  const [about, skills, projects] = await Promise.all([
    loadJSON("data/about.json"),
    loadJSON("data/skills.json"),
    loadJSON("data/projects.json")
  ]);

  if (about) {
    const initial = about.initial || (about.name ? about.name[0] : "M");

    setText("logo-initial", initial);
    setText("avatar-initial", initial);
    setText("logo-name", about.name);
    setText("footer-name", about.name);
    setText("logo-role", about.role);
    setText("card-name", about.name);
    setText("card-role", about.role);
    setText("hero-name", about.name);
    setText("hero-role-text", about.heroRoleLine);
    setText("hero-tagline", about.tagline);
    setText("card-bio", about.bioCard);
    setText("pill-location", about.location);
    setText("pill-focus", about.focus);
    setText("pill-level", about.level);
    setText("pill-status", about.status);
    setText("pill-update", "Last update: " + about.lastUpdate);

    const tagsContainer = document.getElementById("hero-tags");
    if (tagsContainer && Array.isArray(about.heroTags)) {
      tagsContainer.innerHTML = "";
      about.heroTags.forEach((t) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = t;
        tagsContainer.appendChild(span);
      });
    }

    const aboutText = document.getElementById("about-text");
    if (aboutText && Array.isArray(about.aboutParagraphs)) {
      aboutText.innerHTML = "";
      about.aboutParagraphs.forEach((p) => {
        const para = document.createElement("p");
        para.textContent = p;
        aboutText.appendChild(para);
        aboutText.appendChild(document.createElement("br"));
      });
    }

    if (Array.isArray(about.stats)) {
      ["stat-1", "stat-2", "stat-3"].forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el && about.stats[idx]) el.textContent = about.stats[idx];
      });
    }
  }

  if (skills && Array.isArray(skills)) {
    const grid = document.getElementById("skills-grid");
    if (grid) {
      grid.innerHTML = "";
      skills.forEach((s) => {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.innerHTML = `
          <h3>${s.title}</h3>
          <p>${s.description}</p>
          <div class="skill-tags">
            ${
              Array.isArray(s.tags)
                ? s.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join("")
                : ""
            }
          </div>
        `;
        grid.appendChild(card);
      });
    }
  }

  if (projects && Array.isArray(projects)) {
    const grid = document.getElementById("projects-grid");
    if (grid) {
      grid.innerHTML = "";
      projects.forEach((p) => {
        const card = document.createElement("article");
        card.className = "project-card";
        card.innerHTML = `
          <div>
            <div class="project-chip-row">
              <span class="project-chip">${p.category || ""}</span>
              <span>${p.year || ""}</span>
            </div>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.description}</p>
          </div>
          <div class="project-links">
            <a href="${p.demo || "#"}" target="_blank" rel="noreferrer">
              Live Demo <span>↗</span>
            </a>
            <a href="${p.code || "#"}" target="_blank" rel="noreferrer">
              &lt;/&gt; Code
            </a>
          </div>
        `;
        grid.appendChild(card);
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", init);
