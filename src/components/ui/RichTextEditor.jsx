"use client";

import { useEffect, useRef } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
  Unlink
} from "lucide-react";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { normalizeRichTextDocument, normalizeRichTextUrl } from "@/lib/richText.js";

const TEXT_ALIGNMENTS = ["left", "center", "right", "justify"];

const TextAlignment = Extension.create({
  name: "textAlignment",
  addGlobalAttributes() {
    return [
      {
        types: ["heading", "paragraph"],
        attributes: {
          textAlign: {
            default: null,
            parseHTML: (element) => {
              const value = element.style.textAlign;
              return TEXT_ALIGNMENTS.includes(value) ? value : null;
            },
            renderHTML: ({ textAlign }) =>
              TEXT_ALIGNMENTS.includes(textAlign) ? { style: `text-align: ${textAlign}` } : {}
          }
        }
      }
    ];
  }
});

function documentsMatch(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function isAlignmentActive(editor, alignment) {
  if (alignment !== "left") {
    return editor.isActive({ textAlign: alignment });
  }

  return !TEXT_ALIGNMENTS.slice(1).some((value) => editor.isActive({ textAlign: value }));
}

function setAlignment(editor, textAlign) {
  editor
    .chain()
    .focus()
    .updateAttributes("paragraph", { textAlign })
    .updateAttributes("heading", { textAlign })
    .run();
}

function ToolbarButton({ editor, label, icon: Icon, active = false, disabled = false, onClick }) {
  function runCommand(event) {
    event.preventDefault();
    onClick();
  }

  return (
    <button
      type="button"
      className={active ? "rich-text-toolbar-button active" : "rich-text-toolbar-button"}
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={runCommand}
      onClick={(event) => {
        if (event.detail === 0) {
          runCommand(event);
        }
      }}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  );
}

export default function RichTextEditor({
  id,
  value,
  onChange,
  placeholder = "Write the article body...",
  required = false
}) {
  const lastEmittedDocument = useRef("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          autolink: true,
          defaultProtocol: "https",
          openOnClick: false,
          protocols: ["http", "https", "mailto", "tel"],
          HTMLAttributes: {
            rel: "noopener noreferrer"
          }
        }
      }),
      TextAlignment,
      Placeholder.configure({ placeholder })
    ],
    content: normalizeRichTextDocument(value),
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        "aria-required": required ? "true" : "false"
      }
    },
    onUpdate({ editor: currentEditor }) {
      const nextDocument = currentEditor.getJSON();
      lastEmittedDocument.current = JSON.stringify(nextDocument);
      onChange(nextDocument);
    }
  });

  useEffect(() => {
    if (!editor) return;
    if (value && typeof value === "object" && JSON.stringify(value) === lastEmittedDocument.current) {
      return;
    }
    const nextDocument = normalizeRichTextDocument(value);
    if (!documentsMatch(nextDocument, editor.getJSON())) {
      editor.commands.setContent(nextDocument);
    }
  }, [editor, value]);

  function setLink() {
    if (!editor) return;
    const currentHref = editor.getAttributes("link").href || "";
    const nextHref = window.prompt("Enter link URL", currentHref);
    if (nextHref === null) return;

    const href = normalizeRichTextUrl(nextHref);
    if (!href) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  if (!editor) {
    return <div className="rich-text-editor loading">Loading editor...</div>;
  }

  return (
    <div className="rich-text-editor">
      <div className="rich-text-toolbar" aria-label="Rich text controls">
        <ToolbarButton
          editor={editor}
          label="Heading 2"
          icon={Heading2}
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          editor={editor}
          label="Heading 3"
          icon={Heading3}
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <span className="rich-text-toolbar-divider" />
        <ToolbarButton
          editor={editor}
          label="Bold"
          icon={Bold}
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          editor={editor}
          label="Italic"
          icon={Italic}
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          editor={editor}
          label="Strikethrough"
          icon={Strikethrough}
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <span className="rich-text-toolbar-divider" />
        <ToolbarButton
          editor={editor}
          label="Bullet list"
          icon={List}
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          editor={editor}
          label="Numbered list"
          icon={ListOrdered}
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          editor={editor}
          label="Quote"
          icon={Quote}
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <span className="rich-text-toolbar-divider" />
        <ToolbarButton
          editor={editor}
          label="Align left"
          icon={AlignLeft}
          active={isAlignmentActive(editor, "left")}
          onClick={() => setAlignment(editor, "left")}
        />
        <ToolbarButton
          editor={editor}
          label="Align center"
          icon={AlignCenter}
          active={isAlignmentActive(editor, "center")}
          onClick={() => setAlignment(editor, "center")}
        />
        <ToolbarButton
          editor={editor}
          label="Align right"
          icon={AlignRight}
          active={isAlignmentActive(editor, "right")}
          onClick={() => setAlignment(editor, "right")}
        />
        <ToolbarButton
          editor={editor}
          label="Justify"
          icon={AlignJustify}
          active={isAlignmentActive(editor, "justify")}
          onClick={() => setAlignment(editor, "justify")}
        />
        <span className="rich-text-toolbar-divider" />
        <ToolbarButton
          editor={editor}
          label="Add link"
          icon={LinkIcon}
          active={editor.isActive("link")}
          onClick={setLink}
        />
        <ToolbarButton
          editor={editor}
          label="Remove link"
          icon={Unlink}
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        />
        <span className="rich-text-toolbar-divider" />
        <ToolbarButton
          editor={editor}
          label="Undo"
          icon={Undo2}
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          editor={editor}
          label="Redo"
          icon={Redo2}
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>
      <EditorContent className="rich-text-surface" editor={editor} />
    </div>
  );
}
