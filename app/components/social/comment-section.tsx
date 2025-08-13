'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getRecipeComments, createComment, updateComment, deleteComment } from '@/lib/social'
import { CommentWithUser } from '@/types/database'

interface CommentSectionProps {
  recipeId: string
}

export default function CommentSection({ recipeId }: CommentSectionProps) {
  const { user, profile } = useAuth()
  const [comments, setComments] = useState<CommentWithUser[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load comments on mount
  useEffect(() => {
    loadComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId])

  const loadComments = async () => {
    setIsLoading(true)
    try {
      console.log('Loading comments for recipe:', recipeId)
      const data = await getRecipeComments(recipeId)
      console.log('Comments loaded:', data)
      setComments(data)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setIsSubmitting(true)
    try {
      console.log('Creating comment:', { user_id: user.id, recipe_id: recipeId, content: newComment.trim() })
      const comment = await createComment({
        user_id: user.id,
        recipe_id: recipeId,
        content: newComment.trim()
      })
      console.log('Comment created:', comment)

      // Add the new comment to the list
      const newCommentWithUser: CommentWithUser = {
        ...comment,
        username: profile?.username || user.email?.split('@')[0] || 'Anonymous',
        full_name: profile?.full_name || null
      }

      setComments(prev => [...prev, newCommentWithUser])
      setNewComment('')
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    setIsSubmitting(true)
    try {
      await updateComment(commentId, { content: editContent.trim() })
      
      // Update the comment in the list
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editContent.trim(), updated_at: new Date().toISOString() }
          : comment
      ))
      
      setEditingComment(null)
      setEditContent('')
    } catch (error) {
      console.error('Error updating comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    setIsSubmitting(true)
    try {
      await deleteComment(commentId)
      
      // Remove the comment from the list
      setComments(prev => prev.filter(comment => comment.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEditing = (comment: CommentWithUser) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const cancelEditing = () => {
    setEditingComment(null)
    setEditContent('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
                         <textarea
               value={newComment}
               onChange={(e) => setNewComment(e.target.value)}
               placeholder="Share your thoughts about this recipe..."
               className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
               rows={3}
               maxLength={1000}
             />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Post
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              {editingComment === comment.id ? (
                // Edit Mode
                <div className="space-y-3">
                                     <textarea
                     value={editContent}
                     onChange={(e) => setEditContent(e.target.value)}
                     className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                     rows={3}
                     maxLength={1000}
                   />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      disabled={isSubmitting || !editContent.trim()}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={isSubmitting}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.full_name || comment.username || 'Anonymous'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.created_at)}
                        </span>
                        {comment.updated_at !== comment.created_at && (
                          <span className="text-xs text-gray-400">(edited)</span>
                        )}
                      </div>
                                             <p className="text-gray-900 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    {user && user.id === comment.user_id && (
                      <div className="flex gap-1 ml-4">
                        <button
                          onClick={() => startEditing(comment)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit comment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
