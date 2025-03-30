export default function GetAvgRating(ratingArr) {
  if (!Array.isArray(ratingArr) || ratingArr.length === 0) return 0; // Handle undefined, null, or empty array

  const totalReviewCount = ratingArr.reduce((acc, curr) => {
      return acc + (curr?.rating || 0); // Ensure curr.rating exists, else add 0
  }, 0);

  const avgReviewCount = totalReviewCount / ratingArr.length;

  return Math.round(avgReviewCount * 10) / 10; // Round to 1 decimal place
}
