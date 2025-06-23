"use client"

import { z } from "zod"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useTransition } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createEvent } from "@/lib/actions/event.actions";

const recurrenceOptions = ["NONE", "DAILY", "WEEKLY", "MONTHLY", "CUSTOM"] as const;
const priorityOptions = ["P0", "P1", "P2"] as const;

const FormSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),
    date: z.date({ required_error: "Please select a date" }),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    description: z.string().optional(),
    customRecurrence: z.string().optional(),
    recurrence: z.enum(recurrenceOptions),
    priority: z.enum(priorityOptions),
  })
  .refine(
    (data) =>
      data.recurrence !== "CUSTOM" ||
      (data.customRecurrence && data.customRecurrence.trim() !== ""),
    {
      path: ["customRecurrence"],
      message: "Custom recurrence pattern is required when 'Custom' is selected",
    }
  )
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true
      return data.startTime < data.endTime
    },
    {
      path: ["endTime"],
      message: "End time must be after start time",
    }
  )

type EventFormValues = z.infer<typeof FormSchema>

export default function EventForm({ onSuccess }: { onSuccess?: () => void }) {
  const { data: session } = useSession();
  const form = useForm<EventFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      startTime: "",
      endTime: "",
      description: "",
      recurrence: "NONE",
      customRecurrence: "",
      priority: 'P1',
    },
  })

  const [isPending, startTransition] = useTransition()
  const recurrenceValue = useWatch({ control: form.control, name: "recurrence" })

  const onSubmit = (data: EventFormValues) => {
    startTransition(async () => {
      try {
        if (!session?.user?.email) {
          throw new Error("User email not available in session")
        }
        await createEvent(
          {
            title: data.title,
            description: data.description,
            date: data.date.toISOString().split("T")[0],
            startTime: data.startTime,
            endTime: data.endTime,
            recurrence: data.recurrence,
            customRecurrence: data.customRecurrence,
            priority: data.priority,
          },
          session.user.email
        )

        toast.success("Event created successfully")
        form.reset()
        onSuccess?.()
      } catch (error) {
        toast.error("Failed to create event")
        console.error(error)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Sync Up" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start and End Time */}
        <div className="flex w-full gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Recurrence and Priority */}
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Recurrence</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select recurrence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {recurrenceOptions.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorityOptions.map(p => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {recurrenceValue === "CUSTOM" && (
          <FormField
            control={form.control}
            name="customRecurrence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Recurrence Pattern</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Every 3 days" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Optional event details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </Form>
  )
}
