type HeadConfig = {
  title: string;
  description?: string;
  og?: string;
  append?: string;
  meta?: { name: string, content: string }[];
}

export const makeHead = ({
  title,
  append = '',
  description = '',
  og = '',
  meta = [],
}: HeadConfig) => {
  const titleCompleted = `${title}${append}`
  return {
    title: titleCompleted,
    meta: [
      { name: 'description', content: description },
      { name: 'og:title', content: titleCompleted },
      { name: 'og:description', content: description },
      { name: 'og:image', content: og },
      ...meta,
    ]
  }
}

export const useMetaData = (config: HeadConfig) => useHead(makeHead(config))
