import { SocketClient } from '../models/socket-client-model';
import RTCStagingService from '../services/rtcstaging-service';

export const socketOnClose = (
  socketClient: SocketClient,
  rtcStagingService: RTCStagingService
) => {
  const rtcStaging = rtcStagingService.getStaging(socketClient.roomId);
  const clientRole = rtcStaging?.removeClient(socketClient.userId);

  console.log(
    'RTCStaging/socketOnClose error: Removed client role',
    clientRole
  );
};
