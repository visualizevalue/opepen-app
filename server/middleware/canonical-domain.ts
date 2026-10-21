export default defineEventHandler((event) => {
  if (getRequestHost(event) === 'www.opepen.art') {
    const url = getRequestURL(event)
    return sendRedirect(event, `https://opepen.art${url.pathname}${url.search}`, 301)
  }
})
