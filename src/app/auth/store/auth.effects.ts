import { Actions, Effect, EffectsModule, ofType } from '@ngrx/effects';
import * as fromAuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: number;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (respData: any) => {
  const expirationDate = new Date(
    new Date().getTime() + respData.expiresIn * 1000
  );
  return new fromAuthActions.AuthenticateSuccess({
    email: respData.email,
    userId: respData.localId,
    token: respData.idToken,
    expirationDate: expirationDate,
  });
};

const handleError = (errorResponse: any) => {
  let errorMessage = 'Somethig went wrong!';

  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new fromAuthActions.AuthenticateFail(errorMessage));
  }

  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'Email already exists!';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Password is not correct!';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email address not exist!';
      break;
  }
  return of(new fromAuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  API_KEY = environment.firebaseAPIKey;
  loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;
  singupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;

  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(fromAuthActions.SIGNUP_START),
    switchMap((signupAction: fromAuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(this.singupUrl, {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          map((respData) => {
            return handleAuthentication(respData);
          }),
          catchError((errorResponse) => {
            return handleError(errorResponse);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(fromAuthActions.LOGIN_START),
    switchMap((authAction: fromAuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(this.loginUrl, {
          email: authAction.payload.email,
          password: authAction.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          map((respData) => {
            return handleAuthentication(respData);
          }),
          catchError((errorResponse) => {
            return handleError(errorResponse);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(fromAuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
