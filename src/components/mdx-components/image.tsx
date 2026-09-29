import { cx } from 'cva'

export type ImageProps = {
  // Astro passes an imported asset object. Imports can't be resolved in the
  // preview, so `src` is undefined for those and a placeholder is shown instead.
  src?: string | { src: string }
  alt: string
  class?: string
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'>

export function Image({ src, alt, class: classAttr, className, ...props }: ImageProps) {
  const url = typeof src === 'string' ? src : src?.src

  if (!url) {
    return (
      <div className={cx('bg-base-lightest border-1px border-dashed border-base-light padding-2 text-base-dark font-sans-xs', classAttr, className)}>
        <strong>Image not available in preview</strong>
        {alt ? `: ${alt}` : null}
      </div>
    )
  }

  return (
    <img
      {...props}
      src={url}
      alt={alt}
      className={cx(classAttr, className) || undefined}
      loading="lazy"
      decoding="async"
    />
  )
}
