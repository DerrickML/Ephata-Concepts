const ALLOWED_NODE_TYPES = new Set([
  "doc",
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "hardBreak",
  "horizontalRule",
  "text"
]);

const ALLOWED_MARK_TYPES = new Set(["bold", "italic", "strike", "link", "code"]);
const ALLOWED_TEXT_ALIGNMENTS = new Set(["left", "center", "right", "justify"]);

function sanitizeTextAlignment(value) {
  return ALLOWED_TEXT_ALIGNMENTS.has(value) ? value : null;
}

function textAlignmentAttributes(node) {
  const textAlign = sanitizeTextAlignment(node.attrs?.textAlign);
  return textAlign ? { textAlign } : {};
}

export function createEmptyRichTextDocument() {
  return {
    type: "doc",
    content: [{ type: "paragraph" }]
  };
}

export function isRichTextDocument(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && value.type === "doc");
}

export function normalizeRichTextUrl(value) {
  const input = String(value || "").trim();
  if (!input) return "";

  if (input.startsWith("/") && !input.startsWith("//")) {
    return input.includes("..") ? "" : input;
  }

  if (/^(mailto:|tel:)/i.test(input)) {
    return input.replace(/\s/g, "");
  }

  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(input) ? input : `https://${input}`;
  try {
    const url = new URL(withProtocol);
    if ((url.protocol === "http:" || url.protocol === "https:") && !url.username && !url.password) {
      return url.toString();
    }
  } catch {
    return "";
  }

  return "";
}

export function plainTextToRichTextDocument(value, maxTextLength = 12000) {
  const text = String(value || "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxTextLength);

  if (!text) {
    return createEmptyRichTextDocument();
  }

  return {
    type: "doc",
    content: text.split(/\n{2,}/).map((paragraph) => ({
      type: "paragraph",
      content: paragraph.split("\n").flatMap((line, index) => {
        const nodes = [];
        if (index > 0) nodes.push({ type: "hardBreak" });
        if (line) nodes.push({ type: "text", text: line });
        return nodes;
      })
    }))
  };
}

function parsePotentialDocument(value) {
  if (isRichTextDocument(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith("{")) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    return isRichTextDocument(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function sanitizeMarks(marks = []) {
  if (!Array.isArray(marks)) return [];

  return marks
    .map((mark) => {
      if (!mark || !ALLOWED_MARK_TYPES.has(mark.type)) return null;
      if (mark.type === "link") {
        const href = normalizeRichTextUrl(mark.attrs?.href);
        return href ? { type: "link", attrs: { href } } : null;
      }
      return { type: mark.type };
    })
    .filter(Boolean);
}

function sanitizeDocument(document, maxTextLength) {
  let remaining = maxTextLength;

  function sanitizeChildren(content) {
    if (!Array.isArray(content) || remaining <= 0) return [];
    return content.map(sanitizeNode).filter(Boolean);
  }

  function sanitizeNode(node) {
    if (!node || !ALLOWED_NODE_TYPES.has(node.type)) return null;

    if (node.type === "text") {
      const text = String(node.text || "").slice(0, remaining);
      remaining -= text.length;
      if (!text) return null;
      const marks = sanitizeMarks(node.marks);
      return marks.length ? { type: "text", text, marks } : { type: "text", text };
    }

    if (node.type === "hardBreak" || node.type === "horizontalRule") {
      return { type: node.type };
    }

    if (node.type === "heading") {
      const level = Number(node.attrs?.level);
      const safeLevel = [2, 3, 4].includes(level) ? level : 2;
      const content = sanitizeChildren(node.content);
      return content.length
        ? { type: "heading", attrs: { level: safeLevel, ...textAlignmentAttributes(node) }, content }
        : null;
    }

    if (node.type === "orderedList") {
      const content = sanitizeChildren(node.content).filter((child) => child.type === "listItem");
      const start = Math.max(1, Number(node.attrs?.start) || 1);
      return content.length ? { type: "orderedList", attrs: { start }, content } : null;
    }

    if (node.type === "bulletList") {
      const content = sanitizeChildren(node.content).filter((child) => child.type === "listItem");
      return content.length ? { type: "bulletList", content } : null;
    }

    if (node.type === "doc") {
      const content = sanitizeChildren(node.content);
      return content.length ? { type: "doc", content } : createEmptyRichTextDocument();
    }

    const content = sanitizeChildren(node.content);
    if (node.type === "paragraph") {
      const attrs = textAlignmentAttributes(node);
      return content.length
        ? { type: "paragraph", ...(Object.keys(attrs).length ? { attrs } : {}), content }
        : { type: "paragraph", ...(Object.keys(attrs).length ? { attrs } : {}) };
    }
    return content.length ? { type: node.type, content } : null;
  }

  return sanitizeNode(document) || createEmptyRichTextDocument();
}

export function normalizeRichTextDocument(value, maxTextLength = 12000) {
  const document = parsePotentialDocument(value);
  if (document) {
    return sanitizeDocument(document, maxTextLength);
  }
  return plainTextToRichTextDocument(value, maxTextLength);
}

export function richTextToPlainText(value) {
  const document = normalizeRichTextDocument(value);
  const chunks = [];

  function walk(node) {
    if (!node) return;
    if (node.type === "text") {
      chunks.push(node.text || "");
      return;
    }
    if (node.type === "hardBreak") {
      chunks.push("\n");
      return;
    }
    if (node.type === "paragraph" || node.type === "heading" || node.type === "listItem") {
      (node.content || []).forEach(walk);
      chunks.push("\n");
      return;
    }
    (node.content || []).forEach(walk);
  }

  walk(document);
  return chunks.join("").replace(/\n{3,}/g, "\n\n").trim();
}

export function isRichTextEmpty(value) {
  return richTextToPlainText(value).length === 0;
}
