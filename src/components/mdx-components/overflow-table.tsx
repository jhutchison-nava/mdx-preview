export function OverflowTable({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto" tabIndex={0}>
      <table {...props} className="usa-table margin-y-0">
        {children}
      </table>
    </div>
  )
}
