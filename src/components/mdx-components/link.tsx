import type { VariantProps } from 'cva'
import FileDownload from '@uswds/uswds/img/usa-icons/file_download.svg?raw'
import { cva, cx } from 'cva'

import { Icon } from './icon'

// Links are resolved as if the page were on the Blue Button site
const SITE_URL = 'https://bluebutton.cms.gov'

const button = cva({
  variants: {
    variant: {
      primary: 'usa-button',
      secondary: 'usa-button usa-button--secondary',
      outline: 'usa-button usa-button--outline',
      unstyled: 'usa-button usa-button--unstyled',
      inverse: 'usa-button usa-button--outline usa-button--inverse',
      link: 'usa-link',
    },
    size: {
      medium: '',
      large: 'usa-button usa-button--big',
    },
  },
})

const downloadExtsRegex
  = /\.(?:doc|docx|xls|xlsx|xlsm|ppt|pptx|exe|zip|pdf|js|txt|csv|dxf|dwgd|rfa|rvt|dwfx|dwg|wmv|jpg|msi|7z|gz|tgz|wma|mov|avi|mp3|mp4|mobi|epub|swf|rar|json)$/

// Strip the site origin and add trailing slashes, matching the site's `trailingSlash: 'always'`
function formatInternalHref(href: string) {
  const relative = href.startsWith(SITE_URL)
    ? href.slice(SITE_URL.length) || '/'
    : href

  if (!relative.startsWith('/')) {
    return relative
  }

  const url = new URL(relative, SITE_URL)
  url.pathname = url.pathname.replace(/\/*$/, '/')
  return `${url.pathname}${url.search}${url.hash}`
}

export type LinkProps = {
  href?: string
  class?: string
  showIcon?: boolean
} & VariantProps<typeof button> & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export function Link({
  children,
  class: classAttr,
  className,
  href = '',
  showIcon = true,
  size,
  variant = 'link',
  ...props
}: LinkProps) {
  let isExternal = false
  try {
    isExternal = new URL(href, SITE_URL).origin !== SITE_URL
  }
  catch {}

  const isDownload = !isExternal && downloadExtsRegex.test(href)
  const computedHref = isExternal || isDownload ? href : formatInternalHref(href)

  return (
    <a
      href={computedHref}
      target={isExternal || isDownload ? '_blank' : undefined}
      rel={isExternal && !computedHref.includes('cms.gov') ? 'noreferrer' : undefined}
      className={cx(button({ variant, size }), isExternal && showIcon ? 'usa-link--external' : '', classAttr, className)}
      data-tealium={isDownload ? 'download' : undefined}
      {...props}
    >
      {children}
      {isDownload ? <Icon icon={FileDownload} size={2} className="margin-left-05" /> : null}
    </a>
  )
}
