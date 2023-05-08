//@ts-nocheck
import { ADD_USERS, REMOVE_USERS, SET_USER } from "./actionTypes"

interface State {
  currentUser: string | null;
  participants: {
    [userId: string]: string
  };
}

const initialState: State = {
  currentUser: null,
  participants: {},
}

interface SetUserAction {
  type: typeof SET_USER,
  payload: {
    currentUser: any
  }
}

interface AddUsersAction {
  type: typeof ADD_USERS,
  payload: {
    participant: {
      [userId: string]: string
    }
  }
}

interface RemoveUsersAction {
  type: typeof REMOVE_USERS,
  payload: {
    participantKey: string
  }
}

type Action = SetUserAction | AddUsersAction | RemoveUsersAction


export const reducer = (state = initialState, action: Action) => {
  switch(action.type) {
    case SET_USER: {
      let { payload } = action;
      state = {...state, currentUser: {...payload.currentUser}};
      return state
    }
    case ADD_USERS: {
      let { payload } = action;
      const currentUserId = Object.keys(state.currentUser)[0]
      const participantId = Object.keys(payload.participant)[0]
      if(currentUserId === participantId) {
        payload.participant[participantId].currentUser = true;
      }
      let participants = {...state.participants, ...payload.participant}
      state = {...state, participants}
      return state
    }
    case REMOVE_USERS: {
      let { payload } = action;
      let participants = {...state.participants}
      delete participants[payload.participantKey]
      state = {...state, participants};
      return state
    }
    default: {
      return state;
    }
  }
};