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

  async updateSummary(
    summaryId: string,
    text: string
  ): Promise<{ summary?: Summary; error?: string }> {
    const { result, error } = await this.fetch<Summary>('summary/edit', {
      method: 'POST',
      withCredentials: true,
      body: {
        summaryId,
        text,
      },
    });

    if (!result || error) {
      console.log(error);
      return { error };
    }

    return { summary: result };
  }

  async createRoom(
    agenda: string[]
  ): Promise<{ url?: string; error?: string }> {
    const { result, error } = await this.fetch<{ url?: string }>(
      'room/create',
      {
        body: { agenda },
        method: 'POST',
        withCredentials: true,
      }
    );

    if (!result || error) {
      console.log(error);
      return { error };
    }

    console.log(result);
    return { url: result.url };
  }

  async fecthFinalSummary(
    url: string
  ) {
    const { result, error } = await this.fetch<Summary>('summary/finalsummary', {
      method: 'GET',
      withCredentials: true,
      body: {
        url,
      },
    });

    if (!result || error) {
      console.log(error);
      return { error };
    }

    return { summary: result };
  }
}

export default RoomService;
