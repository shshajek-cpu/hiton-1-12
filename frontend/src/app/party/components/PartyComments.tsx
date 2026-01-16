'use client'

import { useState, useRef, useEffect } from 'react'
import type { PartyComment } from '@/types/party'
import { getRelativeTime } from '@/types/party'
import styles from './PartyComments.module.css'

interface PartyCommentsProps {
  comments: PartyComment[]
  canComment: boolean
  onAddComment: (content: string) => Promise<void>
}

export default function PartyComments({
  comments,
  canComment,
  onAddComment
}: PartyCommentsProps) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const commentsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || submitting) return

    setSubmitting(true)
    try {
      await onAddComment(content.trim())
      setContent('')
    } catch (err) {
      alert(err instanceof Error ? err.message : '댓글 작성에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>댓글 {canComment ? '' : '(파티원만 열람 가능)'}</h4>

      <div className={styles.commentList}>
        {comments.length === 0 ? (
          <p className={styles.empty}>아직 댓글이 없습니다.</p>
        ) : (
          comments.map(comment => (
            <div
              key={comment.id}
              className={`${styles.comment} ${comment.is_system_message ? styles.system : ''}`}
            >
              {comment.is_system_message ? (
                <span className={styles.systemMessage}>{comment.content}</span>
              ) : (
                <>
                  <span className={styles.author}>{comment.character_name}:</span>
                  <span className={styles.content}>{comment.content}</span>
                  <span className={styles.time}>{getRelativeTime(comment.created_at)}</span>
                </>
              )}
            </div>
          ))
        )}
        <div ref={commentsEndRef} />
      </div>

      {canComment && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="댓글 입력..."
            value={content}
            onChange={e => setContent(e.target.value)}
            disabled={submitting}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!content.trim() || submitting}
          >
            전송
          </button>
        </form>
      )}
    </div>
  )
}
