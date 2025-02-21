const DEMAND_REQUIREMENT = 80

export const getDemandPercentage = (submission: SetSubmission) => {
  const totalDemand = submission.submission_stats?.demand?.total || 0

  return Math.min(100, totalDemand / DEMAND_REQUIREMENT * 100)
}

