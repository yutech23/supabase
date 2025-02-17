import { FC } from 'react'
import { getAnchor, removeAnchor } from './CustomHTMLElements/CustomHTMLElements.utils'

interface TOCHeader {
  id: number
  lvl: number
  seen: number
  content: string
  slug: string
}

interface Props {
  toc: any
}

const formatSlug = (slug: string) => {
  // [Joshen] We will still provide support for headers declared like this:
  //    ## REST API {#rest-api-overview}
  // At least for now, this was a docusaurus thing.
  if (slug.includes('#')) return slug.split('-#')[1]
  return slug
}

const formatTOCHeader = (content: string) => {
  let begin = false
  const res = []
  for (const x of content) {
    if (x === '`') {
      if (!begin) {
        begin = true
        res.push(`<code class="text-xs border rounded bg-scale-400 border-scale-500">`)
      } else {
        begin = false
        res.push(`</code>`)
      }
    } else {
      res.push(x)
    }
  }
  return res.join('')
}

const TableOfContents: FC<Props> = ({ toc }) => {
  // [Joshen] markdown-toc doesn't seem to read maxdepth from the options passed in
  // Our first level headers will be H2s (H1 is ignored), and we only show up to H3

  return (
    <ul className="toc-menu list-none pl-4 text-[0.8rem] grid gap-2 mt-12">
      {(toc.json as TOCHeader[])
        .filter((item) => item.lvl !== 1 && item.lvl <= 3)
        .map((item: any, i: number) => {
          return (
            <li key={i} id={item.lvl} style={{ marginLeft: `${(item.lvl - 2) * 1}rem` }}>
              <a
                href={`#${formatSlug(item.slug)}`}
                className="text-scale-1000 hover:text-brand-900 transition-colors"
                dangerouslySetInnerHTML={{ __html: formatTOCHeader(removeAnchor(item.content)) }}
              />
            </li>
          )
        })}
    </ul>
  )
}

export default TableOfContents
