import { Fragment } from "react";
import { normalizeRichTextDocument, richTextToPlainText } from "@/lib/richText.js";

const TEXT_ALIGNMENTS = new Set(["left", "center", "right", "justify"]);

function alignmentStyle(node) {
  const textAlign = node.attrs?.textAlign;
  return TEXT_ALIGNMENTS.has(textAlign) ? { textAlign } : undefined;
}

function renderMarks(node, key) {
  let content = node.text || "";

  for (const mark of node.marks || []) {
    if (mark.type === "bold") {
      content = <strong key={`${key}-bold`}>{content}</strong>;
    } else if (mark.type === "italic") {
      content = <em key={`${key}-italic`}>{content}</em>;
    } else if (mark.type === "strike") {
      content = <s key={`${key}-strike`}>{content}</s>;
    } else if (mark.type === "code") {
      content = <code key={`${key}-code`}>{content}</code>;
    } else if (mark.type === "link" && mark.attrs?.href) {
      const href = mark.attrs.href;
      const isExternal = /^https?:\/\//i.test(href);
      content = (
        <a href={href} key={`${key}-link`} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
          {content}
        </a>
      );
    }
  }

  return content;
}

function renderNode(node, key) {
  if (!node) return null;

  if (node.type === "text") {
    return <Fragment key={key}>{renderMarks(node, key)}</Fragment>;
  }

  if (node.type === "hardBreak") {
    return <br key={key} />;
  }

  if (node.type === "horizontalRule") {
    return <hr key={key} />;
  }

  const children = (node.content || []).map((child, index) => renderNode(child, `${key}-${index}`));

  if (node.type === "heading") {
    const level = node.attrs?.level === 3 || node.attrs?.level === 4 ? node.attrs.level : 2;
    const Tag = `h${level}`;
    return <Tag key={key} style={alignmentStyle(node)}>{children}</Tag>;
  }

  if (node.type === "bulletList") {
    return <ul key={key}>{children}</ul>;
  }

  if (node.type === "orderedList") {
    return (
      <ol key={key} start={node.attrs?.start || 1}>
        {children}
      </ol>
    );
  }

  if (node.type === "listItem") {
    return <li key={key}>{children}</li>;
  }

  if (node.type === "blockquote") {
    return <blockquote key={key}>{children}</blockquote>;
  }

  return <p key={key} style={alignmentStyle(node)}>{children}</p>;
}

export default function RichTextRenderer({ value, className = "rich-text" }) {
  if (!richTextToPlainText(value)) {
    return null;
  }

  const document = normalizeRichTextDocument(value);
  return <div className={className}>{(document.content || []).map((node, index) => renderNode(node, index))}</div>;
}
