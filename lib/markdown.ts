/**
 * Tiny, safe Markdown renderer for blog posts.
 * Everything is HTML-escaped first; only a small set of formatting is turned back into tags.
 * Supports: ## / ### headings, paragraphs, - lists, 1. lists, > quotes, ![alt](url) images,
 * **bold**, *italic* and [links](https://...).
 */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const safeUrl = (u: string) => (/^(https?:\/\/|\/)[^\s"'<>]*$/i.test(u) ? u : '#');

function inline(s: string) {
  let out = esc(s);
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, url) => `<img src="${safeUrl(url)}" alt="${alt}" loading="lazy">`);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, url) => {
    const u = safeUrl(url);
    const ext = u.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${u}"${ext}>${text}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  return out;
}

export function renderMarkdown(src: string) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let para: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) html.push(`<p>${para.map(inline).join('<br>')}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) html.push(`<${list.type}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.type}>`);
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^###\s+(.*)/))) {
      flushPara(); flushList();
      html.push(`<h3>${inline(m[1])}</h3>`);
    } else if ((m = line.match(/^##?\s+(.*)/))) {
      flushPara(); flushList();
      html.push(`<h2>${inline(m[1])}</h2>`);
    } else if ((m = line.match(/^>\s?(.*)/))) {
      flushPara(); flushList();
      html.push(`<blockquote>${inline(m[1])}</blockquote>`);
    } else if ((m = line.match(/^\s*[-*]\s+(.*)/))) {
      flushPara();
      if (!list || list.type !== 'ul') { flushList(); list = { type: 'ul', items: [] }; }
      list.items.push(m[1]);
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)/))) {
      flushPara();
      if (!list || list.type !== 'ol') { flushList(); list = { type: 'ol', items: [] }; }
      list.items.push(m[1]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return html.join('\n');
}
