import SummaryScheduler from '../scheduler/scheduler';
import TranscriptionService from './transcription-service';

class SchedulerService {
  private schedulersMap: Map<string, SummaryScheduler>;
  private transcrtiptionService: TranscriptionService;

  constructor(transcrtiptionService: TranscriptionService) {
    this.schedulersMap = new Map();
    this.transcrtiptionService = transcrtiptionService;
  }

  add(roomId: string, agenda: string[]): boolean {
    if (this.schedulersMap.has(roomId)) return true;

    const summaryScheduler = new SummaryScheduler(
      roomId,
      agenda,
      1 * 60 * 1000
    );
    this.schedulersMap.set(roomId, summaryScheduler);

    return true;
  }

  start(roomId: string): boolean {
    if (!this.schedulersMap.has(roomId)) return false;

    this.schedulersMap.get(roomId)!.start(this.transcrtiptionService);
    return true;
  }

  stop(roomId: string): boolean {
    if (!this.schedulersMap.has(roomId)) return false;

    this.schedulersMap.get(roomId)!.stop();
    this.schedulersMap.delete(roomId);
    return true;
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

export default SchedulerService;
