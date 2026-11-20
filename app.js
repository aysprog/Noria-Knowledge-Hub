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
const articles = window.NORIA_ARTICLES;
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
        `<article class="topic-card"><span class="topic-number">0${i + 1}</span><span class="topic-symbol">${t.symbol}</span><h3>${t.name}</h3><p>${t.desc}</p></article>`,
    )
    .join("");
}

function renderArticles() {
  $("articleCatalog").innerHTML = articles.map(articleMarkup).join("");
  $("articleCount").textContent = `${articles.length} ARTICLES`;
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

document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]");
  if (open) openArticle(open.dataset.open);
});
$("dialogClose").addEventListener("click", () => $("articleDialog").close());
$("articleDialog").addEventListener("click", (e) => {
  if (e.target === $("articleDialog")) $("articleDialog").close();
});

$("year").textContent = new Date().getFullYear();
renderTopics();
renderArticles();
