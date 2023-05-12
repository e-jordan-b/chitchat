class ApiService {
  baseUrl: string = 'http://localhost:3000/';

  async fetch<T>(
    endpoint: string,
    withCredentials: boolean
  ): Promise<{ result?: T; error?: string }> {
    const response = await fetch(this.baseUrl + endpoint, {
      credentials: withCredentials ? 'include' : undefined,
    });

    if (!response.ok) {
      // TODO: Pass on error code
      return { error: 'error fetching' };
    }

    const json = await response.json();

    return { result: json as T };
  }
}

export default ApiService;
