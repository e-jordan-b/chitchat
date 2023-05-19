import SchedulerService from '../../services/scheduler-service';
import TranscriptionService from '../../services/transcription-service';
import SummaryScheduler from '../../scheduler/scheduler';

// Mock the dependencies
jest.mock('../../scheduler/scheduler');
jest.mock('../../services/transcription-service');

describe('SchedulerService', () => {
  let roomId = '123';
  let agenda = ['item1', 'item2'];
  let schedulerService: SchedulerService;

  beforeEach(() => {
    jest.clearAllMocks();
    let transcriptionServiceMock = new TranscriptionService();
    schedulerService = new SchedulerService(transcriptionServiceMock);
  });

  describe('add', () => {
    it('adds a room to the schedulersMap', () => {
      const result = schedulerService.add(roomId, agenda);

      expect(result).toBe(true);
      expect(schedulerService['schedulersMap'].size).toBe(1);
      expect(SummaryScheduler).toHaveBeenCalledWith(roomId, agenda, 1*60*1000);
      expect(SummaryScheduler).toHaveBeenCalledTimes(1);
    });

    it('do not add a room that already exists in the schedulersMap', () => {
      schedulerService.add(roomId, agenda);
      schedulerService.add(roomId, agenda);

      expect(schedulerService['schedulersMap'].size).toBe(1);
      expect(SummaryScheduler).toHaveBeenCalledTimes(1);
    });
  });

  describe('start', () => {
    it('starts the transcriptionService only if the room exists in the schedulersMap', () => {
      const result = schedulerService.start(roomId);

      expect(result).toBe(false);
      expect(SummaryScheduler.prototype.start).toHaveBeenCalledTimes(0);
    });

    it('returns true if it starts the transcription service', () => {
      schedulerService.add(roomId, agenda);
      const hasStarted = schedulerService.start(roomId);
      
      expect(hasStarted).toBe(true);
      expect(SummaryScheduler).toHaveBeenCalledTimes(1);
      expect(SummaryScheduler.prototype.start).toHaveBeenCalledTimes(1);
    });
  });

  describe('stop', () => {
    it('stops the transcriptionService only if the room exists in the schedulersMap', () => {
      const result = schedulerService.stop(roomId);

      expect(result).toBe(false);
      expect(SummaryScheduler.prototype.stop).toHaveBeenCalledTimes(0);
    });

    it('stops the transcriptionService and eliminates the roomId in the schedulersMap', () => {
      schedulerService.add(roomId, agenda);
      const hasStarted = schedulerService.start(roomId);
      expect(hasStarted).toBe(true);
      expect(SummaryScheduler).toHaveBeenCalledWith(roomId, agenda, 1*60*1000);

      const hasStopped = schedulerService.stop(roomId);
      expect(hasStopped).toBe(true);
      expect(schedulerService['schedulersMap'].get(roomId)).toBeUndefined();
      expect(SummaryScheduler.prototype.stop).toHaveBeenCalledTimes(1);
    });
  });

  describe('addSchedulerByUrl', () => {
    let summaryScedulerMock = new SummaryScheduler(roomId, agenda); 

    it('adds a roomId Scheduler pair in the schedulersMap', () => {
      schedulerService.addSchedulerByUrl(roomId, summaryScedulerMock);

      expect(schedulerService['schedulersMap'].get(roomId)).toBeDefined();
    });
  });

  describe('getSchedulerByUrl', () => {
    it('gets the summaryScheduler for a roomId only if this exists in the schedulersMap', () => {
      let result = schedulerService.getSchedulerByUrl(roomId);
      expect(result).toBeUndefined();

      schedulerService.add(roomId, agenda);
      result = schedulerService.getSchedulerByUrl(roomId);
      expect(result).toBeDefined()
    });

    // Maybe we can check also that it returns the summaryScheduler
  });

  describe('deleteScheduler', () => {
    it('deletes the roomId<>summaryScheduler pair in the schedulersMap', () => {
      schedulerService.add(roomId, agenda);
      schedulerService.deleteScheduler(roomId);

      expect(schedulerService['schedulersMap'].get(roomId)).toBeUndefined();
    });
  });
});