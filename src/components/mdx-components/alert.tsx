import type { VariantProps } from 'cva'
import { cva } from 'cva'
import * as React from 'react'

const alert = cva({
  base: 'usa-alert',
  variants: {
    variant: {
      info: 'usa-alert--info',
      warning: 'usa-alert--warning',
      success: 'usa-alert--success',
      error: 'usa-alert--error',
      emergency: 'usa-alert--emergency',
    },
    size: {
      slim: 'usa-alert--slim',
    },
    noIcon: {
      true: 'usa-alert--no-icon',
    },
  },
  defaultVariants: {
    variant: 'info',
    noIcon: false,
  },
})

export type AlertProps = ({
  'role'?: 'region'
  'aria-labelledby'?: string
} | {
  'role'?: 'alert' | 'status'
  'aria-labelledby'?: never
}) & ({
  size: 'slim'
  heading?: never
  headingAs?: never
} | {
  size?: never
  heading?: string
  headingAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
}) & VariantProps<typeof alert> & Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> & {
  class?: string
}

export function Alert({
  children,
  class: classAttr,
  className,
  heading,
  headingAs = 'p',
  noIcon,
  // Matches the site: content alerts are regions, not live `role="alert"` announcements
  role = 'region',
  size,
  variant,
  ...props
}: AlertProps) {
  const Element = headingAs
  const uniqueId = React.useId()
  const itemId = role === 'region' ? uniqueId : undefined

  return (
    <div
      {...props}
      className={alert({
        variant,
        size,
        noIcon,
        className: [classAttr, className],
      })}
      role={role}
      aria-labelledby={itemId}
    >
      <div className="usa-alert__body">
        {heading && size !== 'slim'
          ? (
              <Element className="usa-alert__heading text-bold" id={itemId}>
                {heading}
              </Element>
            )
          : null}
        <div className="usa-alert__text">
          {children}
        </div>
      </div>
    </div>
  )
}
