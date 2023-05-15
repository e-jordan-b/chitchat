import RCTStaging from '../signalling-socket/rtc-staging';

class RTCStagingService {
  private stagersMap: Map<string, RCTStaging> = new Map();

  safelyAddStaging(roomUrl: string): RCTStaging {
    if (this.stagersMap.has(roomUrl)) return this.stagersMap.get(roomUrl)!;
    const staging = new RCTStaging();
    this.stagersMap.set(roomUrl, staging);
    return staging;
  }

  getStaging(roomUrl: string): RCTStaging | undefined {
    if (!this.stagersMap.has(roomUrl)) return;
    return this.stagersMap.get(roomUrl);
  }
}

export default RTCStagingService;
