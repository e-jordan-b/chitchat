import SummaryScheduler from "../scheduler/scheduler";

class SummarySchedulerService {
  private schedulersMap: Map<string, SummaryScheduler>;

  constructor() {
    this.schedulersMap = new Map();
  }

  /**
   *
   * @param roomId
   * @param scheduler
   */
  addSchedulerByUrl(roomId: string, scheduler: SummaryScheduler) {
    this.schedulersMap.set(roomId, scheduler);
  }

  /**
   *
   * @param roomId
   * @returns
   */
  getSchedulerByUrl(roomId: string) {
    return this.schedulersMap.get(roomId);
  }

  /**
   *
   * @param roomId
   */
  deleteScheduler(roomId: string) {
    if (this.schedulersMap.has(roomId)) {
    this.schedulersMap.delete(roomId);
  }
  }
}

export default SummarySchedulerService;