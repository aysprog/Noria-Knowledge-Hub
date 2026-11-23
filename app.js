const topics = [
  {
    name: "Account & profile",
    symbol: "◎",
    desc: "Sign-in, profile details and account recovery.",
  },
  {
    name: "Payments & billing",
    symbol: "◇",
    desc: "Payment methods, invoices and refund requests.",
  },
  {
    name: "Privacy & security",
    symbol: "⌑",
    desc: "Privacy controls, safe access and suspicious activity.",
  },
  {
    name: "Orders & delivery",
    symbol: "⌂",
    desc: "Order progress, delivery changes and item issues.",
  },
  { name: "Troubleshooting", symbol: "⌘", desc: "Practical checks for common technical problems." },
];
const STORE = "noria_articles_v1",
  FEEDBACK = "noria_feedback_v1",
  REQUESTS = "noria_support_requests_v1",
  ANALYTICS = "noria_analytics_v1";
const initialArticles = window.NORIA_ARTICLES;
const readStore = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
let articles = readStore(STORE, initialArticles);
const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

function track(type, payload = {}) {
  const events = readStore(ANALYTICS, []);
  events.push({ type, ...payload, date: new Date().toISOString() });
  localStorage.setItem(ANALYTICS, JSON.stringify(events.slice(-2000)));
}

function articleMarkup(a, i) {
  return `<article class="catalog-item"><span class="catalog-number">${String(i + 1).padStart(2, "0")}</span><div><span class="catalog-topic">${esc(a.category)} · ${esc(a.read || "4 min read")}</span><h3>${esc(a.title)}</h3><p>${esc(a.deck)}</p></div><button class="read-link" data-open="${esc(a.id)}">Read article</button></article>`;
}

function renderTopics() {
  $("topicGrid").innerHTML = topics
    .map(
      (t, i) =>
        `<article class="topic-card"><span class="topic-number">0${i + 1}</span><span class="topic-symbol">${t.symbol}</span><h3>${t.name}</h3><p>${t.desc}</p><button data-topic="${esc(t.name)}">View articles</button></article>`,
    )
    .join("");
  $("topicFilter").innerHTML =
    '<option value="all">All collections</option>' +
    topics.map((t) => `<option>${esc(t.name)}</option>`).join("");
  $("supportTopic").innerHTML =
    '<option value="">Choose a topic</option>' +
    topics.map((t) => `<option>${esc(t.name)}</option>`).join("");
}

function renderArticles() {
  let list = [...articles].filter((a) => a.status !== "draft");
  const cat = $("topicFilter").value,
    term = $("searchInput").value.trim().toLowerCase();
  if (cat !== "all") list = list.filter((a) => a.category === cat);
  if (term)
    list = list.filter((a) =>
      (
        a.title +
        " " +
        a.deck +
        " " +
        a.category +
        " " +
        a.sections.map((x) => x.join(" ")).join(" ")
      )
        .toLowerCase()
        .includes(term),
    );
  if ($("sortFilter").value === "az") list.sort((a, b) => a.title.localeCompare(b.title));
  $("articleCatalog").innerHTML = list.map(articleMarkup).join("");
  $("articleCount").textContent = `${list.length} ${list.length === 1 ? "ARTICLE" : "ARTICLES"}`;
  $("emptyState").hidden = list.length > 0;
}

function renderFeatured() {
  const list = articles.filter((a) => a.featured && a.status !== "draft").slice(0, 3);
  $("featuredGrid").innerHTML = list
    .map(
      (a) =>
        `<article class="feature-card"><div class="feature-meta"><span>${esc(a.category)}</span><span>${esc(a.read || "4 min")}</span></div><h3>${esc(a.title)}</h3><p>${esc(a.deck)}</p><button data-open="${esc(a.id)}">Read this guide</button></article>`,
    )
    .join("");
}

function openArticle(id) {
  const a = articles.find((x) => x.id === id);
  if (!a) return;
  track("view", { articleId: id, title: a.title });
  let body = `<article class="article-content"><span class="article-kicker">${esc(a.category)} &nbsp; / &nbsp; ${esc(a.read || "4 min read")}</span><h2 id="dialogTitle">${esc(a.title)}</h2><p class="article-deck">${esc(a.deck)}</p>`;
  for (const [heading, content] of a.sections) {
    body += `<h3>${esc(heading)}</h3><p>${esc(content)}</p>`;
  }
  if (a.callout)
    body += `<div class="article-callout"><strong>Keep in mind</strong><br>${esc(a.callout)}</div>`;
  body += `<div class="feedback"><strong>Was this guide useful?</strong><button data-feedback="yes" data-id="${esc(a.id)}">Yes, helpful</button><button data-feedback="no" data-id="${esc(a.id)}">Not quite</button><span id="feedbackStatus" aria-live="polite"></span></div>`;
  body += "</article>";
  $("dialogBody").innerHTML = body;
  $("articleDialog").showModal();
}

function doSearch() {
  const term = $("searchInput").value.trim();
  if (term) track("search", { term });
  renderArticles();
  $("library").scrollIntoView({ behavior: "smooth" });
  $("suggestions").hidden = true;
}

$("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  doSearch();
});
$("searchInput").addEventListener("input", () => {
  const q = $("searchInput").value.trim().toLowerCase();
  if (q.length < 2) {
    $("suggestions").hidden = true;
    return;
  }
  const hits = articles
    .filter(
      (a) =>
        a.status !== "draft" &&
        (a.title + " " + a.deck + " " + a.category).toLowerCase().includes(q),
    )
    .slice(0, 4);
  $("suggestions").innerHTML = hits
    .map(
      (a) =>
        `<button type="button" data-open="${esc(a.id)}">${esc(a.title)} <small>— ${esc(a.category)}</small></button>`,
    )
    .join("");
  $("suggestions").hidden = !hits.length;
});
document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]");
  if (open) {
    openArticle(open.dataset.open);
    $("suggestions").hidden = true;
    return;
  }
  const topic = e.target.closest("[data-topic]");
  if (topic) {
    $("topicFilter").value = topic.dataset.topic;
    $("searchInput").value = "";
    renderArticles();
    $("library").scrollIntoView({ behavior: "smooth" });
    return;
  }
  const search = e.target.closest("[data-search]");
  if (search) {
    $("searchInput").value = search.dataset.search;
    doSearch();
    return;
  }
  const fb = e.target.closest("[data-feedback]");
  if (fb) {
    const data = readStore(FEEDBACK, []);
    data.push({
      articleId: fb.dataset.id,
      value: fb.dataset.feedback,
      date: new Date().toISOString(),
    });
    track("feedback", { articleId: fb.dataset.id, value: fb.dataset.feedback });
    localStorage.setItem(FEEDBACK, JSON.stringify(data));
    $("feedbackStatus").textContent = "Thank you for your feedback.";
    fb.parentElement.querySelectorAll("button").forEach((b) => (b.disabled = true));
  }
});
$("topicFilter").addEventListener("change", renderArticles);
$("sortFilter").addEventListener("change", renderArticles);
$("dialogClose").addEventListener("click", () => $("articleDialog").close());
$("articleDialog").addEventListener("click", (e) => {
  if (e.target === $("articleDialog")) $("articleDialog").close();
});
$("supportForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  if (!f.reportValidity()) return;
  const data = Object.fromEntries(new FormData(f));
  const requests = readStore(REQUESTS, []);
  const ref =
    "NOR-" + new Date().getFullYear() + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  requests.push({ ...data, ref, status: "Received", createdAt: new Date().toISOString() });
  localStorage.setItem(REQUESTS, JSON.stringify(requests));
  $("formStatus").textContent = `Your message has been recorded in this browser. Reference: ${ref}`;
  f.reset();
});
$("mobileMenu").addEventListener("click", () => {
  const nav = document.querySelector(".topbar nav");
  const opened = nav.classList.toggle("open");
  $("mobileMenu").setAttribute("aria-expanded", String(opened));
});

$("year").textContent = new Date().getFullYear();
renderTopics();
renderFeatured();
renderArticles();
