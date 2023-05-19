export interface User {
  _id: string;
  email: string;
  password?: string;
  createdRooms: string[];
  participatedRooms: string[];
}
