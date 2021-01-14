import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from './auth/user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as fromAuthAction from './store/auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: number;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // emitting data when value changes
  // user = new BehaviorSubject<User>(null);
  // firebase api key from environment
  API_KEY = environment.firebaseAPIKey;

  // user signup api endpoint
  singupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;
  loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  logout() {
    // this.user.next(null);
    this.store.dispatch(new fromAuthAction.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.singupUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(
            res.email,
            res.localId,
            res.idToken,
            res.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.loginUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(
            res.email,
            res.localId,
            res.idToken,
            res.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpireationDate)
    );

    if (loadUser.token) {
      // this.user.next(loadUser);
      const expirationDuration =
        new Date(userData._tokenExpireationDate).getTime() -
        new Date().getTime();
      this.store.dispatch(
        new fromAuthAction.Login({
          email: loadUser.email,
          userId: loadUser.id,
          token: loadUser.token,
          expirationDate: new Date(userData._tokenExpireationDate),
        })
      );
      this.autoLogout(expirationDuration);
    }
  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    // this.user.next(user);
    this.store.dispatch(
      new fromAuthAction.Login({
        email: email,
        userId: id,
        token: token,
        expirationDate: expirationDate,
      })
    );
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'Somethig went wrong!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
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

    return throwError(errorMessage);
  }
}
