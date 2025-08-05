"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Post } from "@/lib/mock-api"
import CommentSection from "./comment-section"

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [commentsCount, setCommentsCount] = useState(post.comments)
  const [showCommentInput, setShowCommentInput] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    setLikesCount(liked ? likesCount - 1 : likesCount + 1)
  }

  const handleCommentClick = () => {
    setShowCommentInput(!showCommentInput)
  }

  const handleCommentSubmit = (comment: string) => {
    console.log(`Comment submitted for post ${post.id}: "${comment}"`)
    setCommentsCount(commentsCount + 1)
    setShowCommentInput(false)
    alert("Comment Posted!") // Using alert for basic feedback
  }

  return (
    <Card className="w-full rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={post.author.avatar || "/placeholder.svg?query=user+avatar"} alt={post.author.name} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <a href="#" className="font-semibold hover:underline">
            {post.author.name}
          </a>
          <time className="text-xs text-muted-foreground">{post.timestamp}</time>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className="text-base leading-relaxed">{post.content}</p>
        {post.image && (
          <div className="mt-4 rounded-lg overflow-hidden border">
            <img
              src={post.image || "/placeholder.svg?height=400&width=600&query=post+image"}
              width={600}
              height={400}
              alt="Post image"
              className="w-full object-cover aspect-[3/2]"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-sm transition-all duration-200 hover:scale-105 hover:bg-red-50 hover:text-red-600"
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
            <span>{likesCount}</span>
            <span className="sr-only">Likes</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-sm transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
            onClick={handleCommentClick}
          >
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span>{commentsCount}</span>
            <span className="sr-only">Comments</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-sm transition-all duration-200 hover:scale-105 hover:bg-green-50 hover:text-green-600"
        >
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <span>Share</span>
          <span className="sr-only">Share</span>
        </Button>
      </CardFooter>
      {showCommentInput && <CommentSection postId={post.id} onCommentSubmit={handleCommentSubmit} />}
    </Card>
  )
}
