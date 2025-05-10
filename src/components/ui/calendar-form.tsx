import { Calendar } from "@/components/ui/calendar"
import { showToast } from "@/components/ui/toastify"

export function CalendarForm() {
  const date = new Date()

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(date) => {
        if (date) {
          showToast("Selected date: " + date.toLocaleDateString(), "success")
        }
      }}
      className="rounded-md border"
    />
  )
}