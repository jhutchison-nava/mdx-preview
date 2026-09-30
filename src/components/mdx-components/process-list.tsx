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

// Like the Blue Button component, this reads `className` (not `class`) and doesn't render a heading
export type ProcessListItemProps = {
  children?: React.ReactNode
  className?: string
  heading?: string
  headingAs?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function ProcessListItem({
  children,
  className,
}: ProcessListItemProps) {
  return (
    <li className={cx('usa-process-list__item', className)}>
      <div className="usa-prose">
        {children}
      </div>
    </li>
  )
}
