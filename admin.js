const KEY = "noria_articles_v1",
  FB = "noria_feedback_v1",
  RQ = "noria_support_requests_v1",
  AN = "noria_analytics_v1";
const $ = (id) => document.getElementById(id);
const get = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};
let articles = get(KEY, window.NORIA_ARTICLES);
const save = () => localStorage.setItem(KEY, JSON.stringify(articles));
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
function render() {
  const feedback = get(FB, []),
    requests = get(RQ, []),
    events = get(AN, []),
    views = events.filter((e) => e.type === "view"),
    searches = events.filter((e) => e.type === "search");
  $("stats").innerHTML = [
    ["" + articles.length, "TOTAL ARTICLES"],
    [articles.filter((a) => a.status !== "draft").length, "PUBLISHED"],
    [views.length, "ARTICLE VIEWS"],
    [searches.length, "SEARCHES"],
    [feedback.length, "FEEDBACK RESPONSES"],
    [requests.length, "SUPPORT ENQUIRIES"],
  ]
    .map((x) => `<div class="stat"><strong>${x[0]}</strong><span>${x[1]}</span></div>`)
    .join("");
  $("articleRows").innerHTML = articles
    .map(
      (a) =>
        `<tr><td><strong>${esc(a.title)}</strong></td><td>${esc(a.category)}</td><td><span class="status-pill">${a.status || "published"}</span></td><td><button data-edit="${esc(a.id)}">Edit</button><button data-toggle="${esc(a.id)}">${a.status === "draft" ? "Publish" : "Unpublish"}</button><button data-delete="${esc(a.id)}">Delete</button></td></tr>`,
    )
    .join("");
}
function edit(a) {
  const f = $("editorForm");
  f.reset();
  f.elements.id.value = a?.id || "";
  f.elements.title.value = a?.title || "";
  f.elements.category.value = a?.category || "Account & profile";
  f.elements.deck.value = a?.deck || "";
  f.elements.read.value = a?.read || "4 min";
  f.elements.sections.value = (a?.sections || []).map((s) => s.join(" | ")).join("\n");
  f.elements.callout.value = a?.callout || "";
  f.elements.featured.checked = !!a?.featured;
  f.elements.status.value = a?.status || "published";
  $("editorHeading").textContent = a ? "Edit article" : "Create article";
  $("editor").showModal();
}
$("newArticle").onclick = () => edit(null);
$("closeEditor").onclick = () => $("editor").close();
$("editorForm").onsubmit = (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  if (!f.reportValidity()) return;
  const d = Object.fromEntries(new FormData(f));
  const sections = d.sections
    .split("\n")
    .map((line) => {
      const i = line.indexOf("|");
      return i < 0
        ? ["Guidance", line.trim()]
        : [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    })
    .filter((x) => x[1]);
  const a = {
    id: d.id || "article-" + Date.now(),
    category: d.category,
    title: d.title,
    deck: d.deck,
    read: d.read,
    sections,
    callout: d.callout,
    featured: f.elements.featured.checked,
    status: d.status,
  };
  const idx = articles.findIndex((x) => x.id === a.id);
  if (idx >= 0) articles[idx] = a;
  else articles.push(a);
  save();
  $("editor").close();
  render();
};
document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.edit) edit(articles.find((a) => a.id === b.dataset.edit));
  if (b.dataset.toggle) {
    const a = articles.find((x) => x.id === b.dataset.toggle);
    a.status = a.status === "draft" ? "published" : "draft";
    save();
    render();
  }
  if (b.dataset.delete && confirm("Delete this article from this browser?")) {
    articles = articles.filter((a) => a.id !== b.dataset.delete);
    save();
    render();
  }
});
render();
