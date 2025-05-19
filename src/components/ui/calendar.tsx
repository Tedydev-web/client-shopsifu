// 'use client'

// import * as React from 'react'
// import { ChevronLeft, ChevronRight } from 'lucide-react'
// import {
//   DayPicker,
//   DayPickerProps,
//   NavbarProps,
// } from 'react-day-picker'
// import { vi } from 'date-fns/locale'

// import { cn } from '@/lib/utils'
// import { Button, buttonVariants } from '@/components/ui/button' // ✅ dùng button của shadcn

// // 🛠️ Custom Navbar using shadcn-ui Button
// function CustomNavbar({ nextMonth, previousMonth, goToMonth }: NavbarProps) {
//   return (
//     <div className="flex justify-between items-center px-2 py-1">
//       <Button
//         variant="ghost"
//         size="icon"
//         type="button"
//         onClick={() => previousMonth && goToMonth(previousMonth)}
//         className="h-7 w-7"
//       >
//         <ChevronLeft className="h-4 w-4" />
//       </Button>
//       <Button
//         variant="ghost"
//         size="icon"
//         type="button"
//         onClick={() => nextMonth && goToMonth(nextMonth)}
//         className="h-7 w-7"
//       >
//         <ChevronRight className="h-4 w-4" />
//       </Button>
//     </div>
//   )
// }

// const CALENDAR_STYLES = {
//   base: 'p-3',
//   months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
//   month: 'space-y-4',
//   caption: 'flex justify-center pt-1 relative items-center',
//   caption_label: 'text-sm font-medium',
//   nav: 'space-x-1 flex items-center',
//   nav_button: (variant: 'outline') =>
//     cn(
//       buttonVariants({ variant }),
//       'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
//     ),
//   nav_position: {
//     previous: 'absolute left-1',
//     next: 'absolute right-1',
//   },
//   table: 'w-full border-collapse space-y-1',
//   head_row: 'flex',
//   head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
//   row: 'flex w-full mt-2',
//   cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
//   day: {
//     base: (variant: 'ghost') =>
//       cn(
//         buttonVariants({ variant }),
//         'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
//       ),
//     range_end: 'day-range-end',
//     selected:
//       'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
//     today: 'bg-accent text-accent-foreground',
//     outside:
//       'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
//     disabled: 'text-muted-foreground opacity-50',
//     range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
//     hidden: 'invisible',
//   },
// }

// type CalendarProps = Partial<DayPickerProps>

// export function Calendar({
//   className,
//   classNames,
//   showOutsideDays = true,
//   locale = vi,
//   ...props
// }: CalendarProps) {
//   return (
//     <DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn(CALENDAR_STYLES.base, className)}
//       locale={locale}
//       classNames={{
//         months: CALENDAR_STYLES.months,
//         month: CALENDAR_STYLES.month,
//         caption: CALENDAR_STYLES.caption,
//         caption_label: CALENDAR_STYLES.caption_label,
//         nav: CALENDAR_STYLES.nav,
//         nav_button: CALENDAR_STYLES.nav_button('outline'),
//         nav_button_previous: CALENDAR_STYLES.nav_position.previous,
//         nav_button_next: CALENDAR_STYLES.nav_position.next,
//         table: CALENDAR_STYLES.table,
//         head_row: CALENDAR_STYLES.head_row,
//         head_cell: CALENDAR_STYLES.head_cell,
//         row: CALENDAR_STYLES.row,
//         cell: CALENDAR_STYLES.cell,
//         day: CALENDAR_STYLES.day.base('ghost'),
//         day_range_end: CALENDAR_STYLES.day.range_end,
//         day_selected: CALENDAR_STYLES.day.selected,
//         day_today: CALENDAR_STYLES.day.today,
//         day_outside: CALENDAR_STYLES.day.outside,
//         day_disabled: CALENDAR_STYLES.day.disabled,
//         day_range_middle: CALENDAR_STYLES.day.range_middle,
//         day_hidden: CALENDAR_STYLES.day.hidden,
//         ...classNames,
//       }}
//       components={{
//         Navbar: CustomNavbar,
//       }}
//       {...props}
//     />
//   )
// }
