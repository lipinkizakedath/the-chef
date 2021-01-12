import { User } from '../../auth//auth/user.model';
import * as fromAuthAction from './auth.actions';

export interface State {
  user: User;
}

const intialState: State = {
  user: null,
};

export function authReducer(
  state: State = intialState,
  action: fromAuthAction.AuthActions
) {
  switch (action.type) {
    case fromAuthAction.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user: user,
      };
    case fromAuthAction.LOGOUT:
      return {
        ...state,
        user: null,
        
      };
    default:
      return state;
  }
}
