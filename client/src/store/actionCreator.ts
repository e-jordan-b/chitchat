import { ADD_USERS, REMOVE_USERS, SET_USER } from "./actionTypes"

export const setUser = (user: any) => {
  return {
    type: SET_USER,
    payload: {
      currentUser: user,
    },
  };
};

export const addParticipant = (participant: any) => {
  return {
    type: ADD_USERS,
    payload: {
      participant,
    },
  };
};

export const removeParticipant = (participantKey: any) => {
  return {
    type: REMOVE_USERS,
    payload: {
      participantKey,
    },
  };
};