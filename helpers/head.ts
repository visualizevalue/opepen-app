export const makeTitle = (title: string) => title + ` | Opepen`

type HeadConfig = {
  title: string;
  description?: string;
  og?: string;
}

export const makeHead = ({
  title: t,
  description = '',
  og = '',
}: HeadConfig) => {
  const title = makeTitle(t)

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'og:title', content: title },
      { name: 'og:description', content: description },
      { name: 'og:image', content: og },
    ]
  }
}

export const useMetaData = (config: HeadConfig) => useHead(makeHead(config))
