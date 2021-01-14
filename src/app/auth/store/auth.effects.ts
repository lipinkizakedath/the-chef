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

@Injectable()
export class AuthEffects {
  API_KEY = environment.firebaseAPIKey;
  loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;

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
            const expirationDate = new Date(
              new Date().getTime() + respData.expiresIn * 1000
            );
            return new fromAuthActions.Login({
              email: respData.email,
              userId: respData.localId,
              token: respData.idToken,
              expirationDate: expirationDate,
            });
          }),
          catchError((error) => {
            return of();
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(fromAuthActions.LOGIN),
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
