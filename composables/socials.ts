export const useSocials = (account) => {
  let socials = account?.socials || []

  if (account?.twitterHandle) {
    socials = [`https://x.com/${account.twitterHandle}`, ...socials].filter(
      (s, index) => !(index > 0 && (s.indexOf('twitter.com') > -1 || s.indexOf('x.com') > -1)),
    )
  }

  const splitSocials = socials.length > 3
  const mainSocials = splitSocials ? socials.slice(0, 2) : socials
  const otherSocials = splitSocials ? socials.slice(2) : []

  return {
    socials,
    splitSocials,
    mainSocials,
    otherSocials,
  }
}
