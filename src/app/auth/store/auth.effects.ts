import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromAuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../auth/user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: number;
  localId: string;
  registered?: boolean;
}

// custom function for handling authentication
const handleAuthentication = (
  email: string,
  userId: string,
  token: string,
  expiresIn: number
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new fromAuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true,
  });
};

// custom function for handling error
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

  // signup effect
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
          tap((respData) => {
            this.authService.setLogoutTimer(respData.expiresIn * 1000);
          }),
          map((respData) => {
            return handleAuthentication(
              respData.email,
              respData.localId,
              respData.idToken,
              respData.expiresIn
            );
          }),
          catchError((errorResponse) => {
            return handleError(errorResponse);
          })
        );
    })
  );

  // login effect
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
          tap((respData) => {
            this.authService.setLogoutTimer(respData.expiresIn * 1000);
          }),
          map((respData) => {
            return handleAuthentication(
              respData.email,
              respData.localId,
              respData.idToken,
              respData.expiresIn
            );
          }),
          catchError((errorResponse) => {
            return handleError(errorResponse);
          })
        );
    })
  );

  // Auto login effects
  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(fromAuthActions.AUTO_LOGIN),
    map(() => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'No user exist' };
      }

      const loadUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpireationDate)
      );

      if (loadUser.token) {
        const expirationDuration =
          new Date(userData._tokenExpireationDate).getTime() -
          new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        // this.user.next(loadUser);

        return new fromAuthActions.AuthenticateSuccess({
          email: loadUser.email,
          userId: loadUser.id,
          token: loadUser.token,
          expirationDate: new Date(userData._tokenExpireationDate),
          redirect: false,
        });

        // this.autoLogout(expirationDuration);
      }
      return { type: 'No user exist' };
    })
  );

  // manula logout effect
  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(fromAuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  // redirect effect when loggout
  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(fromAuthActions.AUTHENTICATE_SUCCESS),
    tap((authActions: fromAuthActions.AuthenticateSuccess) => {
      if (authActions.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
