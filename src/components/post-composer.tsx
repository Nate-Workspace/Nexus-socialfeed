"use client"

import type React from "react"
import { useState } from "react"
import { ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"

interface PostComposerProps {
  isOpen: boolean
  onClose: () => void
}

export default function PostComposer({ isOpen, onClose }: PostComposerProps) {
  const [postContent, setPostContent] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
  }

  const handleSubmit = () => {
    console.log("New post:", { content: postContent, image: imagePreview })
    setPostContent("")
    setImagePreview(null)
    onClose()
    alert("Post created successfully!") // Using alert for basic feedback
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-user.jpg?query=current+user+avatar" alt="@user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          {imagePreview && (
            <div className="relative mt-2">
              <img
                src={imagePreview || "/placeholder.svg?query=image+preview"}
                alt="Image preview"
                className="w-full h-auto rounded-lg object-cover max-h-48"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <Label htmlFor="image-upload" className="cursor-pointer">
            <Button variant="ghost" className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Add Image
            </Button>
            <input id="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
          </Label>
          <Button onClick={handleSubmit} disabled={!postContent.trim()}>
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
