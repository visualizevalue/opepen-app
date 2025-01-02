type HeadConfig = {
  title: string;
  description?: string;
  og?: string;
  append?: string;
  meta?: { name: string, content: string }[];
}

export const makeHead = ({
  title = 'Opepen',
  description = 'Consensus is temporary.',
  og = 'https://opepen.art/og/og.png',
  meta = [],
}: HeadConfig) => {
  return {
    title: title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: og },
      ...meta,
    ]
  }
}

export const useMetaData = (config: HeadConfig) => useHead(makeHead(config))
