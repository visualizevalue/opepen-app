const DEMAND_REQUIREMENT = 80

export const getEditionDemandPercentage = (
  submission: SetSubmission,
  edition: EditionType,
) => {
  return ((submission.submission_stats?.demand[edition] || 0) / edition) * 100
}

export const getDemandPercentage = (submission: SetSubmission) => {
  const totalDemand =
    Math.min(1, submission.submission_stats?.demand[1] || 0) +
    Math.min(4, submission.submission_stats?.demand[4] || 0) +
    Math.min(5, submission.submission_stats?.demand[5] || 0) +
    Math.min(10, submission.submission_stats?.demand[10] || 0) +
    Math.min(20, submission.submission_stats?.demand[20] || 0) +
    Math.min(40, submission.submission_stats?.demand[40] || 0)

  return (totalDemand / DEMAND_REQUIREMENT) * 100
}

export const getDemandEditions = (
  submission: SetSubmission,
  thresholdPercentage: number = 0,
) => {
  return EDITION_KEYS.filter(
    (e) => (submission.submission_stats?.demand[e] || 0) / e >= thresholdPercentage,
  )
}
