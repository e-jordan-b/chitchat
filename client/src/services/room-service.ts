import ApiService from './api-service';

class RoomService extends ApiService {
  async isUrlValid(url: string): Promise<boolean> {
    const { result, error } = await this.fetch<{ valid: boolean }>(
      'room/validate',
      {
        body: { url },
        method: 'POST',
      }
    );

    if (!result || error) {
      console.log(error);
      return false;
    }

    return result.valid;
  }
}

export default RoomService;
