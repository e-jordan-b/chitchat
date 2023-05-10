import SummaryScheduler from "../scheduler/scheduler";

export const schedulers: Map<string, SummaryScheduler> = new Map();

export const setSchedulerInMemoryByUrl = (schedulerId: string, scheduler: SummaryScheduler) => {
  schedulers.set(schedulerId, scheduler)
}

export const getSchedulerByUrl = (schedulerId: string) => {
  return schedulers.get(schedulerId);
}

export const deleteSchedulerFromMemory = (schedulerId: string) => {
  if (schedulers.has(schedulerId)) {
    schedulers.delete(schedulerId);
  }
}