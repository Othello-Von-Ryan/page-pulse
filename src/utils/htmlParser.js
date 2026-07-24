exports.extractTitle = (html) => {
  if (typeof html !== 'string') {
    return '';
  }

  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match || !match[1]) {
    return '';
  }

  return match[1].trim();
};
