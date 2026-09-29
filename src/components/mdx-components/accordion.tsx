import type { VariantProps } from 'cva'
import { cva } from 'cva'
import * as React from 'react'

const accordion = cva({
  base: 'usa-accordion',
  variants: {
    bordered: {
      true: 'usa-accordion--bordered',
    },
    multiselectable: {
      true: 'usa-accordion--multiselectable',
    },
  },
})

export type AccordionListProps = {
  class?: string
  multiselectable?: boolean
} & VariantProps<typeof accordion> & React.HTMLAttributes<HTMLDivElement>

export function AccordionList({
  bordered,
  children,
  class: classAttr,
  className,
  multiselectable,
  ...props
}: AccordionListProps) {
  return (
    <div
      {...props}
      className={accordion({ className: [classAttr, className], multiselectable, bordered })}
      data-allow-multiple={multiselectable}
    >
      {children}
    </div>
  )
}

export type AccordionItemProps = {
  isExpanded?: boolean
  heading: string
  id?: string
  headingAs?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & React.HTMLAttributes<HTMLDivElement>

export function AccordionItem({
  children,
  heading,
  headingAs = 'div',
  id,
  isExpanded = false,
  ...props
}: AccordionItemProps) {
  const Element = headingAs
  const uniqueId = React.useId()
  const itemId = id || uniqueId

  return (
    <>
      <Element className="usa-accordion__heading">
        <button
          className="usa-accordion__button"
          type="button"
          aria-expanded={isExpanded}
          aria-controls={itemId}
        >
          {heading}
        </button>
      </Element>
      <div
        {...props}
        id={itemId}
        className="usa-accordion__content usa-prose"
        hidden={!isExpanded}
      >
        {children}
      </div>
    </>
  )
}
