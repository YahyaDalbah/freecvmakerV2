import { memo, useEffect, useRef, useState } from "react";
import InputLabel from "./InputLabel";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Markdown } from "tiptap-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBold, faItalic, faUnderline, faStrikethrough,
    faListUl, faListOl,
    faLink, faLinkSlash, faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { useAutoSave } from "../../../contexts/AutoSaveContext";

function ToolbarButton({ onClick, active, title, children }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                active
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            }`}
        >
            {children}
        </button>
    );
}

const Divider = () => <div className="w-px h-4 bg-gray-300 mx-0.5 flex-shrink-0" />;

function TextAreaInput({ span = false, label, name: _name, value = "", onChange }: {
    span?: boolean;
    label?: string;
    name: string;
    value: string | undefined;
    onChange: (value: string) => void;
}) {
    const { startSaving } = useAutoSave();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Tracks the last value we pushed to parent so we don't re-set editor content
    // when the parent echoes our own onChange back as a prop update.
    const lastSentRef = useRef(value ?? "");
    const linkInputRef = useRef<HTMLInputElement>(null);
    const colorInputRef = useRef<HTMLInputElement>(null);
    const [linkBarOpen, setLinkBarOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
            }),
            // html: true lets tiptap-markdown emit <u> and <span style="color:…">
            // for marks that have no pure-markdown equivalent.
            Markdown.configure({ html: true, transformPastedText: true }),
            Placeholder.configure({ placeholder: "Add a description…" }),
        ],
        content: value ?? "",
        onUpdate: ({ editor }) => {
            const md = (editor.storage as any).markdown.getMarkdown();
            if (md === lastSentRef.current) return;
            lastSentRef.current = md;
            startSaving();
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => onChange(md), 900);
        },
    });

    // Sync editor when value changes from outside (e.g. loading saved data).
    useEffect(() => {
        if (!editor || value === lastSentRef.current) return;
        lastSentRef.current = value ?? "";
        editor.commands.setContent(value ?? "");
    }, [value, editor]);

    const openLinkBar = () => {
        const href = editor?.getAttributes("link").href as string ?? "";
        setLinkUrl(href);
        setLinkBarOpen(true);
        setTimeout(() => linkInputRef.current?.focus(), 0);
    };

    const applyLink = () => {
        if (!editor) return;
        const url = linkUrl.trim();
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        } else {
            editor.chain().focus().unsetLink().run();
        }
        setLinkBarOpen(false);
    };

    const handleLinkClick = () => {
        if (editor?.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            setLinkBarOpen(false);
        } else {
            openLinkBar();
        }
    };

    const activeColor = editor?.getAttributes("textStyle").color as string | undefined;

    return (
        <div className={`flex flex-col gap-2 ${span ? "col-span-2" : ""}`}>
            <InputLabel label={label} />
            <div className="border border-gray-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-shadow bg-white">

                {/* ── Toolbar ─────────────────────────────────────────── */}
                <div className="flex items-center gap-0.5 px-1.5 py-1 border-b border-gray-200 bg-gray-50 flex-wrap">
                    <ToolbarButton title="Bold (Ctrl+B)" onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")}>
                        <FontAwesomeIcon icon={faBold} size="xs" />
                    </ToolbarButton>
                    <ToolbarButton title="Italic (Ctrl+I)" onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")}>
                        <FontAwesomeIcon icon={faItalic} size="xs" />
                    </ToolbarButton>
                    <ToolbarButton title="Underline (Ctrl+U)" onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")}>
                        <FontAwesomeIcon icon={faUnderline} size="xs" />
                    </ToolbarButton>
                    <ToolbarButton title="Strikethrough" onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive("strike")}>
                        <FontAwesomeIcon icon={faStrikethrough} size="xs" />
                    </ToolbarButton>

                    <Divider />

                    <ToolbarButton title="Bullet list" onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")}>
                        <FontAwesomeIcon icon={faListUl} size="xs" />
                    </ToolbarButton>
                    <ToolbarButton title="Numbered list" onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")}>
                        <FontAwesomeIcon icon={faListOl} size="xs" />
                    </ToolbarButton>

                    <Divider />

                    <ToolbarButton
                        title={editor?.isActive("link") ? "Remove link" : "Insert link"}
                        onClick={handleLinkClick}
                        active={editor?.isActive("link")}
                    >
                        <FontAwesomeIcon icon={editor?.isActive("link") ? faLinkSlash : faLink} size="xs" />
                    </ToolbarButton>

                    {/* Color — hidden native picker triggered by button click */}
                    <div className="relative flex-shrink-0">
                        <ToolbarButton
                            title={activeColor ? "Change text color (click to remove)" : "Text color"}
                            onClick={() => {
                                if (activeColor) {
                                    editor?.chain().focus().unsetColor().run();
                                } else {
                                    colorInputRef.current?.click();
                                }
                            }}
                            active={!!activeColor}
                        >
                            <span className="flex flex-col items-center gap-[2px] leading-none">
                                <FontAwesomeIcon icon={faPalette} size="xs" />
                                <span
                                    className="w-3 h-[2px] rounded-full block"
                                    style={{ backgroundColor: activeColor ?? "currentColor" }}
                                />
                            </span>
                        </ToolbarButton>
                        <input
                            ref={colorInputRef}
                            type="color"
                            defaultValue="#374151"
                            tabIndex={-1}
                            className="absolute opacity-0 pointer-events-none w-0 h-0"
                            onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                        />
                    </div>
                </div>

                {/* ── Link bar (shown when inserting / editing a link) ── */}
                {linkBarOpen && (
                    <form
                        className="flex items-center gap-2 px-2 py-1.5 border-b border-blue-100 bg-blue-50"
                        onSubmit={(e) => { e.preventDefault(); applyLink(); }}
                    >
                        <FontAwesomeIcon icon={faLink} size="xs" className="text-blue-400 shrink-0" />
                        <input
                            ref={linkInputRef}
                            type="url"
                            placeholder="https://…"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Escape") setLinkBarOpen(false); }}
                            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 min-w-0"
                        />
                        <button type="submit" className="text-xs font-medium text-blue-600 hover:text-blue-800 px-1 shrink-0">
                            Apply
                        </button>
                        <button type="button" className="text-xs text-gray-400 hover:text-gray-600 px-1 shrink-0" onClick={() => setLinkBarOpen(false)}>
                            Cancel
                        </button>
                    </form>
                )}

                {/* ── Editor content ───────────────────────────────────── */}
                <EditorContent editor={editor} className="tiptap-editor" />
            </div>
        </div>
    );
}

export default memo(TextAreaInput);
