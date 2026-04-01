import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, forwardRef, useImperativeHandle } from "react";

const MenuBar = ({ editor, darkMode = false }) => {
  if (!editor) return null;

  const baseBtn = `p-2 rounded hover:bg-purple-100 transition-colors`;
  const activeBtn = `p-2 rounded bg-purple-100 text-purple-700`;
  const darkBaseBtn = `p-2 rounded hover:bg-purple-600/30 text-purple-300`;
  const darkActiveBtn = `p-2 rounded bg-purple-600/40 text-purple-200`;
  const btn = darkMode ? darkBaseBtn : baseBtn;
  const active = darkMode ? darkActiveBtn : activeBtn;

  const setLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className={`flex flex-wrap gap-1 p-2 border-b ${darkMode ? "border-gray-700 bg-[#0a0515]" : "border-gray-200 bg-gray-50"}`}>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? active : btn}
        title="Heading 1"
      >
        <span className={`font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>H1</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? active : btn}
        title="Heading 2"
      >
        <span className={`font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>H2</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? active : btn}
        title="Heading 3"
      >
        <span className={`font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>H3</span>
      </button>

      <div className={`w-px h-6 ${darkMode ? "bg-gray-600" : "bg-gray-300"} mx-1 self-center`} />

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? active : btn}
        title="Bold"
      >
        <span className={`font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>B</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? active : btn}
        title="Italic"
      >
        <span className={`italic ${darkMode ? "text-white" : "text-gray-700"}`}>I</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? active : btn}
        title="Underline"
      >
        <span className={`underline ${darkMode ? "text-white" : "text-gray-700"}`}>U</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? active : btn}
        title="Strikethrough"
      >
        <span className={`line-through ${darkMode ? "text-white" : "text-gray-700"}`}>S</span>
      </button>

      <div className={`w-px h-6 ${darkMode ? "bg-gray-600" : "bg-gray-300"} mx-1 self-center`} />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? active : btn}
        title="Bullet List"
      >
        <span className={darkMode ? "text-white" : "text-gray-700"}>•</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? active : btn}
        title="Numbered List"
      >
        <span className={`font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>1.</span>
      </button>

      <div className={`w-px h-6 ${darkMode ? "bg-gray-600" : "bg-gray-300"} mx-1 self-center`} />

      <button onClick={setLink} className={editor.isActive("link") ? active : btn} title="Add Link">
        <span className={darkMode ? "text-purple-300" : "text-purple-600"}>🔗</span>
      </button>
      <button onClick={addImage} className={btn} title="Add Image">
        <span className={darkMode ? "text-purple-300" : "text-purple-600"}>🖼️</span>
      </button>
    </div>
  );
};

export default forwardRef(function TiptapEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = "300px",
  darkMode = false,
}, ref) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-purple-600 underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded" },
      }),
      Underline,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: ` prose prose-sm max-w-none focus:outline-none ${darkMode ? "prose-invert text-white" : "text-gray-800"}`,
        style: `min-height: ${minHeight}`,
      },
    },
  });

  useImperativeHandle(ref, () => editor, [editor]);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value]);

  return (
    <div className={`border rounded-lg overflow-hidden ${darkMode ? "border-gray-700 bg-[#0a0515]" : "border-gray-200 bg-white"}`}>
      <MenuBar editor={editor} darkMode={darkMode} />
      <EditorContent editor={editor} className={`p-4 ${darkMode ? "text-white" : "text-gray-800"}`} />
    </div>
  );
});

export function insertText(editor, text) {
  if (editor) {
    editor.chain().focus().insertContent(text).run();
  }
}