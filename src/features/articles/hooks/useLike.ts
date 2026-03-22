'use client'

import { useState } from 'react'
import { likeArticleAction, unlikeArticleAction } from '@/features/articles/actions/like.action'

type UseLikeParams = {
  articleId: string
  initialLiked: boolean
  initialCount: number
}

export function useLike({ articleId, initialLiked, initialCount }: UseLikeParams) {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)

  const toggleLike = async () => {
    setIsLoading(true)
    try {
      const result = isLiked
        ? await unlikeArticleAction({ articleId })
        : await likeArticleAction({ articleId })

      if (!result.success) {
        alert(result.error)
        return
      }

      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    } catch{
      alert('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return { isLiked, likeCount, isLoading, toggleLike }
}
