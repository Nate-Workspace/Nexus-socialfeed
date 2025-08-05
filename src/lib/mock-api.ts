export interface Author {
  id: string
  name: string
  avatar: string
}

export interface Post {
  id: string
  author: Author
  timestamp: string
  content: string
  image?: string
  likes: number
  comments: number
}

const mockAuthors: Author[] = [
  { id: "1", name: "Alice Johnson", avatar: "/placeholder-user.jpg?query=user+avatar+1" },
  { id: "2", name: "Bob Smith", avatar: "/placeholder-user.jpg?query=user+avatar+2" },
  { id: "3", name: "Charlie Brown", avatar: "/placeholder-user.jpg?query=user+avatar+3" },
  { id: "4", name: "Diana Prince", avatar: "/placeholder-user.jpg?query=user+avatar+4" },
  { id: "5", name: "Eve Adams", avatar: "/placeholder-user.jpg?query=user+avatar+5" },
]

const generateMockPosts = (offset: number, limit: number): Post[] => {
  const posts: Post[] = []
  for (let i = 0; i < limit; i++) {
    const id = `post-${offset + i}`
    const author = mockAuthors[(offset + i) % mockAuthors.length]
    const timestamp = new Date(Date.now() - (offset + i) * 3600 * 1000).toLocaleString()
    const content = `This is a mock post number ${offset + i} by ${author.name}. It's great to be building a social feed! #react #typescript #shadcn`
    const hasImage = Math.random() > 0.5
    const image = hasImage ? `/placeholder.svg?height=400&width=600&query=abstract+image+${offset + i}` : undefined
    const likes = Math.floor(Math.random() * 500) + 10
    const comments = Math.floor(Math.random() * 50) + 2

    posts.push({
      id,
      author,
      timestamp,
      content,
      image,
      likes,
      comments,
    })
  }
  return posts
}

export const fetchPostsMockApi = async (
  offset: number,
  limit: number,
): Promise<{ posts: Post[]; hasMore: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPosts = generateMockPosts(offset, limit)
      const hasMore = offset + limit < 30
      resolve({ posts: newPosts, hasMore })
    }, 1000) 
  })
}