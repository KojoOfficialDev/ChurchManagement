import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const billingData = [
  {
    date: 'May 11, 25 03:11:07 PM',
    amount: '450',
    plan: 'Basic',
    status: 'Paid',
  },
  {
    date: 'May 12, 25 03:12:15 PM',
    amount: '450',
    plan: 'Standard',
    status: 'Paid',
  },
  {
    date: 'May 13, 25 03:13:22 PM',
    amount: '100',
    plan: 'Standard',
    status: 'Paid',
  },
  {
    date: 'May 14, 25 03:14:30 PM',
    amount: '230',
    plan: 'Standard',
    status: 'Paid',
  },
  {
    date: 'May 15, 25 03:15:38 PM',
    amount: '120',
    plan: 'Standard',
    status: 'Paid',
  },
  {
    date: 'May 16, 25 03:16:45 PM',
    amount: '400',
    plan: 'Standard',
    status: 'Paid',
  },
  {
    date: 'May 17, 25 03:17:53 PM',
    amount: '230',
    plan: 'Standard',
    status: 'Paid',
  },
  {
    date: 'May 18, 25 03:18:00 PM',
    amount: '120',
    plan: 'Standard',
    status: 'Paid',
  },
  {
    date: 'May 19, 25 03:19:08 PM',
    amount: '400',
    plan: 'Standard',
    status: 'Paid',
  },
  {
    date: 'May 20, 25 03:20:15 PM',
    amount: '230',
    plan: 'Standard',
    status: 'Premium',
  },
]

const pageNumbers = [1, 2, 3, 4, 5]

export const BillingTable = () => {
  return (
    <section className="flex flex-col items-start gap-2 w-full">
      <div className="flex flex-col items-start w-full bg-white rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
        <header className="flex items-center justify-between w-full bg-white border-b border-solid border-[#eaecf0] px-6 py-5">
          <h2 className="font-bold text-gray-800 text-xl leading-5 [font-family:'Inter',Helvetica] tracking-[0]">
            Billing history
          </h2>
        </header>

        <div className="w-full bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#fbfcfc] border-b border-[#eaecf0] hover:bg-[#fbfcfc]">
                <TableHead className="w-[75px]">
                  <Checkbox />
                </TableHead>
                <TableHead className="font-medium text-gray-800 text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                  Date
                </TableHead>
                <TableHead className="font-medium text-gray-800 text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                  Amount (GHS)
                </TableHead>
                <TableHead className="font-medium text-gray-800 text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                  Plan
                </TableHead>
                <TableHead className="font-medium text-gray-800 text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingData.map((row, index) => (
                <TableRow key={index} className="border-b border-[#eaecf0]">
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-normal text-gray-800 text-xs leading-5 [font-family:'Inter',Helvetica] tracking-[0]">
                    {row.date}
                  </TableCell>
                  <TableCell className="font-normal text-gray-800 text-xs leading-5 [font-family:'Inter',Helvetica] tracking-[0]">
                    {row.amount}
                  </TableCell>
                  <TableCell className="font-normal text-gray-800 text-xs leading-5 [font-family:'Inter',Helvetica] tracking-[0]">
                    {row.plan}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#ebfdf2] text-[#037847] hover:bg-[#ebfdf2] font-medium text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0] rounded-2xl px-2 py-0.5">
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-start justify-center gap-2.5 px-3 py-2 w-full border-t border-solid border-[#eaecf0]">
          <div className="w-full h-1.5 bg-[#eaecf0] rounded-xl" />
        </div>
      </div>

      <div className="w-full bg-white rounded-lg shadow-[0px_1px_11.7px_1px_#b9b9b914] px-4 py-3">
        <div className="flex items-center justify-between w-full">
          <div className="font-normal text-gray-800 text-xs [font-family:'Inter',Helvetica] tracking-[0] leading-[normal]">
            1-15 of 100 items
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 p-0"
                disabled
              >
                <ChevronsLeftIcon className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-3">
                {pageNumbers.map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === 1 ? 'default' : 'ghost'}
                    className={`h-7 w-[30px] p-0 ${
                      pageNum === 1
                        ? "font-bold text-gray-800 text-xs [font-family:'Inter',Helvetica] tracking-[0]"
                        : "font-normal text-gray-800 text-xs [font-family:'Inter',Helvetica] tracking-[0]"
                    }`}
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>
            </div>

            <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            <Select defaultValue="15">
              <SelectTrigger className="h-7 w-[51px] font-medium text-gray-800 text-xs text-center [font-family:'Inter',Helvetica] tracking-[0]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="font-normal text-gray-800 text-xs [font-family:'Inter',Helvetica] tracking-[0]">
              Items per page
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
