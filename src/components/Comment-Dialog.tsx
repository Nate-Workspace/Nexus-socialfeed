import { useState } from "react"

interface Comment {
  id: number
  text: string
  author: string
}

interface CommentDialogProps {
  open: boolean
  onClose: () => void
  comments: Comment[]
  onAddComment: (text: string) => void
}

export default function CommentDialog({ open, onClose, comments, onAddComment }: CommentDialogProps) {
  const [input, setInput] = useState("")

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex items-center">
          <input
            className="flex-1 border rounded px-2 py-1 mr-2"
            placeholder="Write a comment..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && input.trim()) {
                onAddComment(input.trim())
                setInput("")
              }
            }}
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => {
              if (input.trim()) {
                onAddComment(input.trim())
                setInput("")
              }
            }}
          >
            Post
          </button>
          <button className="ml-2 text-gray-500" onClick={onClose}>✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {comments.length === 0 && (
            <div className="text-gray-400 text-center">No comments yet.</div>
          )}
          {comments.map(c => (
            <div key={c.id} className="border-b pb-2">
              <div className="font-semibold">{c.author}</div>
              <div>{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}