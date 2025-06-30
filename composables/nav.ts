export const SUB_NAV_ITEMS = {
  '^/(?:sets|submissions)(?:/)?$': [
    {
      to: '/sets',
      text: 'Sets',
    },
    {
      to: '/submissions',
      text: 'Submissions',
    },
  ],
  '^/opepen/burned': [
    {
      to: '/opepen/burned',
      text: 'Gallery',
    },
    {
      to: '/opepen/burned/stats',
      text: 'Stats',
    },
  ],
}
