"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Home, Compass, User, Plus, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import PostCard from "@/components/post-card"
import PostComposer from "@/components/post-composer"
import PostSkeleton from "@/components/post-skeleton"
import { usePosts } from "@/hooks/use-posts"
import type { Post } from "@/lib/mock-api"
import { cn } from "@/lib/utils"

interface SidebarProps {
  children: React.ReactNode
  onNewPostClick: () => void 
  mainRef: React.RefObject<HTMLElement | null>
}

const Sidebar: React.FC<SidebarProps> = ({ children, onNewPostClick, mainRef }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) 
      if (window.innerWidth < 768) {
        setIsOpen(false) 
      } else {
        setIsOpen(true) 
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() 
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16",
          isMobile && (isOpen ? "w-64" : "w-0 overflow-hidden"),
          "md:relative md:flex md:shrink-0",
        )}
      >
        <div className="flex h-16 items-center justify-center p-4">
          {isOpen ? (
            <h1 className="text-2xl font-bold text-primary">SocialFeed</h1>
          ) : (
            <Home className="h-6 w-6 text-primary" />
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <nav className="space-y-1">
            {[
              { title: "Home", icon: Home, url: "#", isActive: true },
              { title: "Explore", icon: Compass, url: "#" },
              { title: "Profile", icon: User, url: "#" },
            ].map((item) => (
              <Button
                key={item.title}
                variant={item.isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3", !isOpen && "justify-center")}
                asChild
              >
                <a href={item.url}>
                  <item.icon className="h-5 w-5" />
                  {isOpen && <span>{item.title}</span>}
                </a>
              </Button>
            ))}
          </nav>
          <div className="mt-auto pt-4">
            <Button
              className={cn("w-full justify-start gap-3", !isOpen && "justify-center")}
              onClick={onNewPostClick} 
            >
              <Plus className="h-5 w-5" />
              {isOpen && <span>New Post</span>}
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          {isMobile && (
            <Button variant="ghost" size="icon" className="-ml-1" onClick={() => setIsOpen(!isOpen)}>
              <PanelLeft className="h-6 w-6" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
          <h2 className="text-xl font-semibold">Home</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg?query=user+avatar" alt="@user" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </>
  )
}

export default function App() {
  const { posts, loading, hasMore, initialLoad, loadMorePosts } = usePosts()
  const lastPostRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLElement>(null) // Ref for the main scrollable area
  const [isComposerOpen, setIsComposerOpen] = useState(false) 

  useEffect(() => {
    initialLoad()
  }, [initialLoad]) 

  useEffect(() => {
    const currentLastPostRef = lastPostRef.current
    const currentMainContentRef = mainContentRef.current

    if (!currentLastPostRef || !currentMainContentRef || !hasMore || posts.length === 0) {
      return // Do not set up observer if conditions are not met
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !loading) {
          loadMorePosts()
        }
      },
      {
        root: currentMainContentRef,
        threshold: 0.1,
      },
    )

    observer.observe(currentLastPostRef)

    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [lastPostRef, mainContentRef, loading, hasMore, loadMorePosts, posts.length]) 

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar onNewPostClick={() => setIsComposerOpen(true)} mainRef={mainContentRef}>
        <div className="mx-auto max-w-2xl space-y-4">
          <PostComposer isOpen={isComposerOpen} onClose={() => setIsComposerOpen(false)} />
          <Separator className="my-4" />
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {loading && (
            <>
              <PostSkeleton onCommentSubmit={() => {}} />
              <PostSkeleton onCommentSubmit={() => {}}/>
              <PostSkeleton onCommentSubmit={() => {}}/>
            </>
          )}
          {!loading && hasMore && (
            <div ref={lastPostRef} className="text-center py-4 text-muted-foreground">
              Scroll to load more posts...
            </div>
          )}
          {!hasMore && !loading && posts.length > 0 && (
            <div className="text-center py-4 text-muted-foreground">You've reached the end of the feed.</div>
          )}
        </div>
      </Sidebar>
    </div>
  )
}
