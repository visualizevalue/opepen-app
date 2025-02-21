type HeadConfig = {
  title: string;
  description?: string;
  og?: string;
  append?: string;
  meta?: { name: string, content: string }[];
}

const makeHead = ({
  title = 'Opepen',
  description = 'Consensus is temporary.',
  og = '/og/intro.png',
  meta = [],
}: HeadConfig) => {
  const image = og.startsWith(`http`) ? og : ('https://' + useConfig('domain') + og)

  return {
    title: title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      ...meta,
    ]
  }
}

export const useMetaData = (config: HeadConfig) => useHead(makeHead(config))
