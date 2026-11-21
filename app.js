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
const REQUESTS = "noria_support_requests_v1";
const articles = window.NORIA_ARTICLES;
const readStore = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

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
  let body = `<article class="article-content"><span class="article-kicker">${esc(a.category)} &nbsp; / &nbsp; ${esc(a.read || "4 min read")}</span><h2 id="dialogTitle">${esc(a.title)}</h2><p class="article-deck">${esc(a.deck)}</p>`;
  for (const [heading, content] of a.sections) {
    body += `<h3>${esc(heading)}</h3><p>${esc(content)}</p>`;
  }
  if (a.callout)
    body += `<div class="article-callout"><strong>Keep in mind</strong><br>${esc(a.callout)}</div>`;
  body += "</article>";
  $("dialogBody").innerHTML = body;
  $("articleDialog").showModal();
}

function doSearch() {
  renderArticles();
  $("library").scrollIntoView({ behavior: "smooth" });
}

$("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  doSearch();
});
document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]");
  if (open) {
    openArticle(open.dataset.open);
    return;
  }
  const topic = e.target.closest("[data-topic]");
  if (topic) {
    $("topicFilter").value = topic.dataset.topic;
    $("searchInput").value = "";
    renderArticles();
    $("library").scrollIntoView({ behavior: "smooth" });
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
