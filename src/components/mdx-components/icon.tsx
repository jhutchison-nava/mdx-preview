import type { VariantProps } from 'cva'
import { cva } from 'cva'

const iconStyles = cva({
  base: 'usa-icon text-middle',
  variants: {
    size: {
      2: 'usa-icon--size-2',
      3: 'usa-icon--size-3',
      4: 'usa-icon--size-4',
      5: 'usa-icon--size-5',
    },
    color: {
      'white': 'text-white',
      'base-darkest': 'text-base-darkest',
      'base-dark': 'text-base-dark',
    },
  },
})

export type IconProps = VariantProps<typeof iconStyles> & {
  /** Raw SVG markup, e.g. imported with `?raw` */
  icon: string
  className?: string
}

// Inlines the SVG like Astro's SVG components do, so it can be styled with USWDS classes
export function Icon({ icon, color, size, className }: IconProps) {
  const viewBox = icon.match(/viewBox="([^"]+)"/)?.[1]
  const body = icon.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, '')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={iconStyles({ size, color, className })}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  )
}
