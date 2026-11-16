import { promisify } from 'node:util'
import { brotliCompress, gzip, constants } from 'node:zlib'

const brotli = promisify(brotliCompress)
const gzipAsync = promisify(gzip)

const COMPRESSIBLE =
  /^(text\/|application\/(json|javascript|xml|manifest\+json)|image\/svg\+xml)/
const MIN_BYTES = 1024

/*
 * Compress rendered responses. The Node server sends pages as plain text
 * otherwise: several hundred kilobytes per page, a few megabytes on the
 * largest. Static files under /_nuxt are precompressed at build time
 * (`nitro.compressPublicAssets`) and never reach this hook as strings.
 *
 * It runs on `beforeResponse`, after route caching, so cached pages are
 * stored once as text and compressed per request for whatever the client
 * accepts.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', async (event, response) => {
    const body = response.body
    if (typeof body !== 'string' || body.length < MIN_BYTES) return
    if (getResponseHeader(event, 'content-encoding')) return

    const type = String(getResponseHeader(event, 'content-type') || '')
    if (!COMPRESSIBLE.test(type)) return

    const accepts = String(getRequestHeader(event, 'accept-encoding') || '')
    const encoding = /\bbr\b/.test(accepts) ? 'br' : /\bgzip\b/.test(accepts) ? 'gzip' : null

    appendResponseHeader(event, 'vary', 'Accept-Encoding')
    if (!encoding) return

    const input = Buffer.from(body, 'utf8')
    const output =
      encoding === 'br'
        ? await brotli(input, {
            params: {
              // Quality 4 is close to gzip's size at a fraction of the time of 11.
              [constants.BROTLI_PARAM_QUALITY]: 4,
              [constants.BROTLI_PARAM_SIZE_HINT]: input.length,
            },
          })
        : await gzipAsync(input, { level: 6 })

    setResponseHeader(event, 'content-encoding', encoding)
    setResponseHeader(event, 'content-length', output.length)
    response.body = output
  })
})
