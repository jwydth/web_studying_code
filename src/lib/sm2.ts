// Spaced Repetition System (SM-2 Algorithm)
// grade q in [0..5]
export function sm2(
  ef: number = 2.5,
  interval: number = 0,
  reps: number = 0,
  q: number
) {
  if (q >= 3) {
    if (reps === 0) interval = 1
    else if (reps === 1) interval = 6
    else interval = Math.round(interval * ef)
    reps = reps + 1
  } else {
    reps = 0
    interval = 1
  }
  ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  if (ef < 1.3) ef = 1.3
  return { ef, interval, reps }
}

export function calculateNextReview(
  ef: number,
  interval: number,
  reps: number,
  grade: number
): Date {
  const { interval: newInterval } = sm2(ef, interval, reps, grade)
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)
  return nextReview
}

export function getDueCards(
  reviews: Array<{ due: Date; cardId: string }>
): string[] {
  const now = new Date()
  return reviews
    .filter(review => review.due <= now)
    .map(review => review.cardId)
}


