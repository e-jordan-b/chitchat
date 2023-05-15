import { Summary } from '../models/summary-model';
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

  async fetchSummaries(
    url: string
  ): Promise<{ summaries?: Summary[]; error?: string }> {
    const { result, error } = await this.fetch<Summary[]>(
      `summary/?url=${url}`,
      {
        method: 'GET',
        withCredentials: true,
      }
    );

    if (!result || error) {
      console.log(error);
      return { error };
    }

    return { summaries: result };
  }
}

export default RoomService;
