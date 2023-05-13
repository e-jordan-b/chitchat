class RCTStaging {
  private host: string | undefined;
  private hostSDP: string | undefined;
  private hostICE: string[] = [];
  private guest: string | undefined;
  private guestSDP: string | undefined;
  private guestICE: string[] = [];

  /**
   * The number of currently connected clients.
   * Min=0, Max=2
   */
  get clientsConnected(): number {
    let count = 0;

    if (this.host) count++;
    if (this.guest) count++;

    return count;
  }

  get isHostConnected(): boolean {
    return this.host !== undefined;
  }

  get isGuestConnected(): boolean {
    return this.guest !== undefined;
  }

  /**
   * Adds the client to either a host or guest role.
   * @param clientId
   * @returns 0 for host, 1 for guest, -1 for error
   */
  addClient(clientId: string): number {
    if (!this.host) {
      this.host = clientId;
      return 0;
    }

    if (!this.guest) {
      this.guest = clientId;
      return 1;
    }

    return -1;
  }

  /**
   * Removes the client from either the host or guest role.
   * @param clientId
   * @returns 0 for host, 1 for guest, -1 for error
   */
  removeClient(clientId: string): number {
    if (this.host === clientId) {
      this.host = undefined;
      return 0;
    }

    if (this.guest === clientId) {
      this.guest = undefined;
      return 1;
    }

    return -1;
  }

  addHostSDP(sdp: string) {
    this.hostSDP = sdp;
  }
}

export default RCTStaging;
