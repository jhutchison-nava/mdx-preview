import ArrowForward from '@uswds/uswds/img/usa-icons/arrow_forward.svg?raw'

import { Icon } from './icon'

export type IconListProps = {
  children?: React.ReactNode
  intro?: string
}

export function IconList({ children, intro }: IconListProps) {
  return (
    <div className="grid-row grid-gap margin-y-4">
      <div className="grid-col-auto">
        <Icon icon={ArrowForward} size={5} />
      </div>
      <div className="grid-col-fill">
        {intro ? <p className="usa-intro measure-4">{intro}</p> : null}
        {children}
      </div>
    </div>
  )
}
