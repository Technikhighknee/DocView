import { marked } from 'marked';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';

const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
  const highlighted = lang && hljs.getLanguage(lang)
    ? hljs.highlight(text, { language: lang }).value
    : hljs.highlightAuto(text).value;
  return `<pre><code class="hljs ${lang ?? ''}">${highlighted}</code></pre>`;
};

marked.use({ renderer });

export function parseMarkdown(md: string): string {
  const html = marked.parse(md);
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt'],
    },
  });
}
