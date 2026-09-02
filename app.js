(() => {
  "use strict";

  const data = window.SITE_DATA;
  if (!data) return;

  const monthNames = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const escapeHTML = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const thaiDateParts = (isoDate) => {
    const [year, month, day] = isoDate.split("-").map(Number);
    return {
      day: String(day),
      month: monthNames[month - 1],
      year: String(year + 543),
    };
  };

  const articleDateLabel = (isoDate) => {
    const date = thaiDateParts(isoDate);
    return `${Number(date.day)} ${date.month} ${date.year}`;
  };

  const articleURL = (article) => article.url || `https://www.dmc.tv/article/${article.id}`;

  const renderEvents = () => {
    const list = document.querySelector("#event-list");
    if (!list) return;

    const events = [...data.events].sort((a, b) => a.date.localeCompare(b.date));
    list.innerHTML = events
      .map((event) => {
        const date = thaiDateParts(event.date);
        return `
          <a class="event-item" href="${escapeHTML(event.source)}" target="_blank" rel="noopener noreferrer">
            <div class="event-date" aria-label="${date.day} ${date.month} ${date.year}">
              <strong>${date.day}</strong>
              <span>${date.month}<br>${date.year}</span>
            </div>
            <div class="event-info">
              <h4>${escapeHTML(event.title)}</h4>
              <p>${escapeHTML(event.location)}</p>
            </div>
            <span class="event-time">${escapeHTML(event.time)} <span aria-hidden="true">↗</span></span>
          </a>`;
      })
      .join("");
  };

  const articlePanel = document.querySelector("#article-panel");
  const articleSearch = document.querySelector("#article-search");
  const articleStatus = document.querySelector("#article-status");
  const articleMore = document.querySelector("#article-more");
  const tabs = [...document.querySelectorAll("[data-article-type]")];
  const PAGE_SIZE = 8;
  let activeType = "invite";
  let searchQuery = "";
  let visibleCount = PAGE_SIZE;

  const renderArticles = () => {
    if (!articlePanel) return;

    const primaryURL = data.primarySource.url;
    const articles = data.articles
      .filter((article) => article.type === activeType)
      .filter((article) => {
        if (!searchQuery) return true;
        const searchableText = [article.title, article.summary, article.label, articleDateLabel(article.date)]
          .join(" ")
          .toLocaleLowerCase("th");
        return searchableText.includes(searchQuery);
      })
      .sort((a, b) => {
        if (articleURL(a) === primaryURL) return -1;
        if (articleURL(b) === primaryURL) return 1;
        return b.date.localeCompare(a.date);
      });

    const visibleArticles = articles.slice(0, visibleCount);
    articlePanel.innerHTML = visibleArticles
      .map(
        (article) => `
          <a class="article-item" href="${escapeHTML(articleURL(article))}" target="_blank" rel="noopener noreferrer">
            <div class="article-meta">
              <time datetime="${escapeHTML(article.date)}">${escapeHTML(articleDateLabel(article.date))}</time>
              <span>${escapeHTML(article.label)}</span>
            </div>
            <div class="article-copy">
              <h3>${escapeHTML(article.title)}</h3>
              <p>${escapeHTML(article.summary)}</p>
            </div>
            <span class="article-arrow" aria-hidden="true">↗</span>
          </a>`,
      )
      .join("");

    if (!articles.length) {
      articlePanel.innerHTML = `
        <div class="article-empty">
          <strong>ไม่พบบทความที่ตรงกับคำค้น</strong>
          <p>ลองค้นด้วยชื่อจังหวัด ชื่องาน หรือจำนวนพระสงฆ์อีกครั้ง</p>
        </div>`;
    }

    if (articleStatus) {
      const shown = Math.min(visibleArticles.length, articles.length);
      articleStatus.textContent = `แสดง ${shown} จาก ${articles.length} บทความ`;
    }

    if (articleMore) {
      const remaining = articles.length - visibleArticles.length;
      articleMore.hidden = remaining <= 0;
      articleMore.textContent = remaining > PAGE_SIZE
        ? `แสดงอีก ${PAGE_SIZE} บทความ`
        : `แสดงอีก ${remaining} บทความ`;
    }
  };

  const updateTab = (activeTab) => {
    tabs.forEach((tab) => {
      const isActive = tab === activeTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    articlePanel?.setAttribute("aria-labelledby", activeTab.id);
    activeType = activeTab.dataset.articleType;
    visibleCount = PAGE_SIZE;
    renderArticles();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => updateTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
      updateTab(nextTab);
      nextTab.focus();
    });
  });

  document.querySelector("#invite-count").textContent = data.articles.filter(
    (article) => article.type === "invite",
  ).length;
  document.querySelector("#review-count").textContent = data.articles.filter(
    (article) => article.type === "review",
  ).length;
  document.querySelector("#article-total").textContent = data.articles.length;

  articleSearch?.addEventListener("input", (event) => {
    searchQuery = event.currentTarget.value.trim().toLocaleLowerCase("th");
    visibleCount = PAGE_SIZE;
    renderArticles();
  });

  articleMore?.addEventListener("click", () => {
    visibleCount += PAGE_SIZE;
    renderArticles();
  });

  const header = document.querySelector("#site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = [...document.querySelectorAll("#primary-nav a")];

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const closeNavigation = () => {
    header?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  navToggle?.addEventListener("click", () => {
    const willOpen = !header.classList.contains("is-open");
    header.classList.toggle("is-open", willOpen);
    navToggle.setAttribute("aria-expanded", String(willOpen));
    document.body.classList.toggle("nav-open", willOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNavigation));
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeNavigation();
  });
  updateHeader();

  const revealItems = [...document.querySelectorAll(".reveal")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.1 },
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const currentThaiYear = new Date().getFullYear() + 543;
  const copyrightYear = document.querySelector("#copyright-year");
  if (copyrightYear) copyrightYear.textContent = String(currentThaiYear);

  renderEvents();
  renderArticles();
})();
