export enum Recurrence {
  NONE = "None",
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
  CUSTOM = "Custom",
}

export enum Priority {
  P0 = "P0",
  P1 = "P1",
  P2 = "P2",
}


export const recurrenceOptions = Object.values(Recurrence)
export const priorityOptions = Object.values(Priority)
