import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

type ExpenseDetailsProps = {
  expense: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ExpenseDetails = ({
  expense,
  open,
  onOpenChange,
}: ExpenseDetailsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Expense Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh_-_200px)]">
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-base">{expense.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge variant={expense.isActive ? 'default' : 'destructive'}>
                  {expense.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="space-y-2 col-span-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <p className="text-base">{expense.description}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <p className="text-base">{expense.categoryName || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Amount Spent
                </p>
                <p className="text-base">
                  ${expense.amountSpent?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Payment Method
                </p>
                <p className="text-base">{expense.paymentMethod}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Supplier
                </p>
                <p className="text-base">{expense.suppliersName || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Expense Date
                </p>
                <p className="text-base">
                  {expense.expenseDate
                    ? format(new Date(expense.expenseDate), 'PPP')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ExpenseDetails

