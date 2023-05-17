import ApiService from './api-service';

class CallsService extends ApiService {


  async fetchCalls(roomId: string) {
    const { result, error } = await this.fetch(
      `summary/getusersummaries/${roomId}`,
      {
        method: 'GET',
        withCredentials: true,
      }
    );

    if (!result || error) {
      console.log(error);
      return { error };
    }

    return { fetchCalls: result };
  }


}


export default CallsService;
