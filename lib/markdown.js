function parseInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
}

function markdownToHtml(markdown) {
  const lines = String(markdown || '').split(/\r?\n/);
  const html = [];
  let listOpen = false;

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      if (listOpen) {
        html.push('</ul>');
        listOpen = false;
      }
      return;
    }

    if (trimmed.startsWith('## ')) {
      if (listOpen) {
        html.push('</ul>');
        listOpen = false;
      }
      html.push(`<h4>${parseInline(trimmed.slice(3))}</h4>`);
      return;
    }

    if (trimmed.startsWith('- ')) {
      if (!listOpen) {
        html.push('<ul>');
        listOpen = true;
      }
      html.push(`<li>${parseInline(trimmed.slice(2))}</li>`);
      return;
    }

    if (listOpen) {
      html.push('</ul>');
      listOpen = false;
    }
    html.push(`<p>${parseInline(trimmed)}</p>`);
  });

  if (listOpen) {
    html.push('</ul>');
  }

  return html.join('');
}

module.exports = {
  markdownToHtml,
};
