'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link2
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  onImageUpload?: (file: File) => Promise<string>
}

export default function RichTextEditor({ content, onChange, onImageUpload }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-biblical-burgundy underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'biblical-input min-h-[400px] max-h-[600px] overflow-y-auto',
      },
    },
  })

  if (!editor) {
    return null
  }

  const addImage = async () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onImageUpload) return

    try {
      const url = await onImageUpload(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image')
    }
  }

  return (
    <div className="border-2 border-biblical-olive rounded-lg overflow-hidden">
      <div className="bg-biblical-sand p-2 flex flex-wrap gap-2 border-b-2 border-biblical-olive">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-biblical-parchment ${
            editor.isActive('bold') ? 'bg-biblical-parchment' : ''
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-biblical-parchment ${
            editor.isActive('italic') ? 'bg-biblical-parchment' : ''
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <div className="w-px bg-biblical-olive" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-biblical-parchment ${
            editor.isActive('heading', { level: 1 }) ? 'bg-biblical-parchment' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-biblical-parchment ${
            editor.isActive('heading', { level: 2 }) ? 'bg-biblical-parchment' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-biblical-parchment ${
            editor.isActive('heading', { level: 3 }) ? 'bg-biblical-parchment' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>
        <div className="w-px bg-biblical-olive" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-biblical-parchment ${
            editor.isActive('bulletList') ? 'bg-biblical-parchment' : ''
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-biblical-parchment ${
            editor.isActive('orderedList') ? 'bg-biblical-parchment' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-biblical-parchment ${
            editor.isActive('blockquote') ? 'bg-biblical-parchment' : ''
          }`}
          title="Quote"
        >
          <Quote size={18} />
        </button>
        <div className="w-px bg-biblical-olive" />
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-biblical-parchment ${
            editor.isActive('link') ? 'bg-biblical-parchment' : ''
          }`}
          title="Add Link"
        >
          <Link2 size={18} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-biblical-parchment"
          title="Add Image URL"
        >
          <ImageIcon size={18} />
        </button>
        {onImageUpload && (
          <label className="p-2 rounded hover:bg-biblical-parchment cursor-pointer" title="Upload Image">
            <ImageIcon size={18} className="inline" />
            <span className="ml-1 text-xs">Upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
        <div className="w-px bg-biblical-olive" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-biblical-parchment disabled:opacity-50"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-biblical-parchment disabled:opacity-50"
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
