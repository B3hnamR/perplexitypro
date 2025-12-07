"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Link as LinkIcon, Heading1, Heading2, Quote } from 'lucide-react';
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
            Image.configure({ inline: true }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-white',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
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

                // آپلود به سرور خودمان (که به S3 می‌فرستد)
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

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0f172a]">
            {/* Toolbar */}
            <div className="bg-[#1e293b] p-2 flex flex-wrap gap-1 border-b border-white/10">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'text-cyan-400 bg-white/10' : 'text-gray-400'}`}><Bold size={18}/></button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'text-cyan-400 bg-white/10' : 'text-gray-400'}`}><Italic size={18}/></button>
                <div className="w-px bg-white/10 mx-1"></div>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 2 }) ? 'text-cyan-400 bg-white/10' : 'text-gray-400'}`}><Heading1 size={18}/></button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 3 }) ? 'text-cyan-400 bg-white/10' : 'text-gray-400'}`}><Heading2 size={18}/></button>
                <div className="w-px bg-white/10 mx-1"></div>
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'text-cyan-400 bg-white/10' : 'text-gray-400'}`}><List size={18}/></button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('orderedList') ? 'text-cyan-400 bg-white/10' : 'text-gray-400'}`}><ListOrdered size={18}/></button>
                <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'text-cyan-400 bg-white/10' : 'text-gray-400'}`}><Quote size={18}/></button>
                <div className="w-px bg-white/10 mx-1"></div>
                <button type="button" onClick={setLink} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('link') ? 'text-cyan-400 bg-white/10' : 'text-gray-400'}`}><LinkIcon size={18}/></button>
                <button type="button" onClick={addImage} className="p-2 rounded hover:bg-white/10 text-gray-400"><ImageIcon size={18}/></button>
            </div>
            
            <EditorContent editor={editor} />
        </div>
    );
}