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

// Inlines the SVG like Astro's SVG components do: the source <svg> attributes are kept
// (minus xmlns), and the USWDS classes and aria-hidden are added
export function Icon({ icon, color, size, className }: IconProps) {
  const [, attrs = '', body = ''] = icon.match(/<svg([^>]*)>([\s\S]*)<\/svg>/) ?? []
  const svgAttributes = Object.fromEntries(
    [...attrs.matchAll(/([\w:-]+)="([^"]*)"/g)]
      .filter(([, name]) => name !== 'xmlns')
      .map(([, name, value]) => [name, value]),
  )

  return (
    <svg
      {...svgAttributes}
      className={iconStyles({ size, color, className })}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  )
}
