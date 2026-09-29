import { cx } from 'cva'

export type ProcessListProps = {
  class?: string
} & React.HTMLAttributes<HTMLOListElement>

export function ProcessList({
  children,
  class: classAttr,
  className,
  ...props
}: ProcessListProps) {
  return (
    <ol {...props} className={cx('usa-process-list margin-top-1', classAttr, className)}>
      {children}
    </ol>
  )
}

export type ProcessListItemProps = {
  children?: React.ReactNode
  class?: string
  className?: string
  // Accepted for parity with the Blue Button component, which doesn't render them
  heading?: string
  headingAs?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function ProcessListItem({
  children,
  class: classAttr,
  className,
}: ProcessListItemProps) {
  return (
    <li className={cx('usa-process-list__item', classAttr, className)}>
      <div className="usa-prose">
        {children}
      </div>
    </li>
  )
}
