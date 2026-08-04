import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * پاکسازی اولیه فرمول LaTeX
 */
function cleanLatex(raw) {
  return raw.trim();
}

/**
 * تبدیل متن ساده markdown به React elements (پشتیبانی بولد، ایتالیک، لینک ساده)
 */
function parseMarkdownInline(text) {
  const elements = [];
  let lastIndex = 0;

  // regex ترکیبی: لینک، بولد، ایتالیک، فرمول inline \( ... \)
  const regex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\\\((.+?)\\\))/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      elements.push(
        <a href={match[3]} target="_blank" rel="noopener noreferrer" key={match.index}>
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      elements.push(<strong key={match.index}>{match[5]}</strong>);
    } else if (match[6]) {
      elements.push(<em key={match.index}>{match[7]}</em>);
    } else if (match[8]) {
      elements.push(
        <span dir="ltr" style={{ display: 'inline-block', textAlign: 'left' }} key={match.index}>
          <InlineMath math={cleanLatex(match[9])} />
        </span>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}

/**
 * جدا کردن فرمول inline \( ... \) از متن و رندر متن + markdown
 */
function splitInlineMathWithMarkdown(text) {
  const elements = [];
  let lastIndex = 0;
  const regex = /\\\((.+?)\\\)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index);
      elements.push(...parseMarkdownInline(before));
    }
    elements.push(
      <span dir="ltr" style={{ display: 'inline-block', textAlign: 'left' }} key={`inline-${match.index}`}>
        <InlineMath math={cleanLatex(match[1])} />
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    elements.push(...parseMarkdownInline(text.slice(lastIndex)));
  }

  return elements;
}

/**
 * تابع کمکی: متن ساده رو خط به خط پردازش می‌کنه برای هدر و متن با فرمول inline و markdown
 */
function splitTextByLineWithMarkdown(text, keyStart=0) {
  const lines = text.split('\n');
  const elements = [];
  let keyIndex = keyStart;

  for (let line of lines) {
    line = line.trim();

    if (!line) {
      elements.push(<br key={`br-${keyIndex++}`} />);
      continue;
    }

    // چک هدر
    const headerMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      const Tag = `h${level}`;

      elements.push(
        <Tag key={`header-${keyIndex++}`}>{splitInlineMathWithMarkdown(content)}</Tag>
      );
      continue;
    }

    // خط معمولی با markdown و فرمول inline
    elements.push(<p key={`p-${keyIndex++}`}>{splitInlineMathWithMarkdown(line)}</p>);
  }

  return elements;
}

/**
 * تابع اصلی: متن رو با استخراج بلاک فرمول‌های چندخطی و سپس خط به خط پردازش میکنه
 */
export function splitByMath(text) {
  if (!text) return null;

  const elements = [];
  let lastIndex = 0;
  let keyIndex = 0;
  const mathBlockRegex = /(\$\$([\s\S]+?)\$\$|\\\[((?:.|\n)+?)\\\])/g;

  let match;
  while ((match = mathBlockRegex.exec(text)) !== null) {
    // متن قبل بلاک فرمول
    if (match.index > lastIndex) {
      const segment = text.slice(lastIndex, match.index);
      elements.push(...splitTextByLineWithMarkdown(segment, keyIndex));
      keyIndex += segment.split('\n').length * 10; // افزایش کلید تقریبی
    }

    const rawMath = match[2] || match[3] || '';
    elements.push(
      <div dir="ltr" style={{ textAlign: 'left' }} key={`block-${keyIndex++}`}>
        <BlockMath math={cleanLatex(rawMath)} />
      </div>
    );
    lastIndex = match.index + match[0].length;
  }

  // متن بعد آخرین بلاک فرمول
  if (lastIndex < text.length) {
    const segment = text.slice(lastIndex);
    elements.push(...splitTextByLineWithMarkdown(segment, keyIndex));
  }

  return elements;
}
