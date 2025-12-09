"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// ✅ تغییر ۱: استفاده از ImageResize به جای Image معمولی
import ImageResize from 'tiptap-extension-resize-image';
import Link from '@tiptap/extension-link';
import { 
    Bold, Italic, List, ListOrdered, Image as ImageIcon, Link as LinkIcon, 
    Heading1, Heading2, Quote, Undo, Redo, Minus, Code 
} from 'lucide-react';
import axios from 'axios';

interface RichEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export default function RichEditor({ content, onChange }: RichEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            // ✅ تغییر ۲: کانفیگ افزونه تغییر سایز
            ImageResize.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-6 text-white text-lg leading-relaxed',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    if (!editor) return null;

    const addImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            if (input.files?.length) {
                const file = input.files[0];
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const res = await axios.post('/api/admin/blog/upload', formData);
                    if (res.data.url) {
                        editor.chain().focus().setImage({ src: res.data.url }).run();
                    }
                } catch (err) {
                    alert("آپلود عکس با خطا مواجه شد");
                }
            }
        };
        input.click();
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const ToolbarButton = ({ onClick, isActive, icon: Icon }: any) => (
        <button 
            type="button" 
            onClick={onClick} 
            className={`p-2 rounded-lg transition-all ${
                isActive 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
        >
            <Icon size={18}/>
        </button>
    );

    return (
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0f172a] shadow-2xl">
            {/* Toolbar */}
            <div className="bg-[#1e293b] p-3 flex flex-wrap items-center gap-2 border-b border-white/10 sticky top-0 z-10">
                <div className="flex gap-1">
                    <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={Undo} />
                    <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={Redo} />
                </div>
                
                <div className="w-px h-6 bg-white/10 mx-2"></div>

                <div className="flex gap-1">
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleBold().run()} 
                        isActive={editor.isActive('bold')} 
                        icon={Bold} 
                    />
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleItalic().run()} 
                        isActive={editor.isActive('italic')} 
                        icon={Italic} 
                    />
                     <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
                        isActive={editor.isActive('codeBlock')} 
                        icon={Code} 
                    />
                </div>

                <div className="w-px h-6 bg-white/10 mx-2"></div>

                <div className="flex gap-1">
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
                        isActive={editor.isActive('heading', { level: 2 })} 
                        icon={Heading1} 
                    />
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
                        isActive={editor.isActive('heading', { level: 3 })} 
                        icon={Heading2} 
                    />
                </div>

                <div className="w-px h-6 bg-white/10 mx-2"></div>

                <div className="flex gap-1">
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleBulletList().run()} 
                        isActive={editor.isActive('bulletList')} 
                        icon={List} 
                    />
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
                        isActive={editor.isActive('orderedList')} 
                        icon={ListOrdered} 
                    />
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleBlockquote().run()} 
                        isActive={editor.isActive('blockquote')} 
                        icon={Quote} 
                    />
                </div>

                <div className="w-px h-6 bg-white/10 mx-2"></div>

                <div className="flex gap-1">
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().setHorizontalRule().run()} 
                        icon={Minus} 
                    />
                    <ToolbarButton 
                        onClick={setLink} 
                        isActive={editor.isActive('link')} 
                        icon={LinkIcon} 
                    />
                    <ToolbarButton 
                        onClick={addImage} 
                        icon={ImageIcon} 
                    />
                </div>
            </div>
            
            <EditorContent editor={editor} />
            
            {/* استایل کمکی برای هندل‌های تغییر سایز */}
            <style jsx global>{`
                .ProseMirror img {
                    transition: all 0.2s;
                }
                .ProseMirror img.ProseMirror-selectednode {
                    outline: 3px solid #06b6d4;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
}