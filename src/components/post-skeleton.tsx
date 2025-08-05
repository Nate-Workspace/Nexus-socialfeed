"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CommentSectionProps {
  postId?: string
  onCommentSubmit: (comment: string) => void
}

export default function CommentSection({ onCommentSubmit }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!commentText.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    onCommentSubmit(commentText)
    setCommentText("")
    setIsSubmitting(false)
    alert("Comment Posted!") // Using alert for basic feedback
  }

  return (
    <div className="flex items-start gap-3 p-4 border-t bg-muted/20">
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder-user.jpg?query=current+user+avatar" alt="@currentuser" />
        <AvatarFallback>CU</AvatarFallback>
      </Avatar>
      <div className="flex-1 grid gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="min-h-[40px] resize-none"
          rows={1}
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!commentText.trim() || isSubmitting} size="sm">
            {isSubmitting ? "Posting..." : "Comment"}
          </Button>
        </div>
      </div>
    </div>
  )
}
