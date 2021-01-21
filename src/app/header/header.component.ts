import { Component, OnDestroy, OnInit } from '@angular/core';
import { pipe, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';
import * as fromAuthAction from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userSubscription: Subscription;

  constructor(
    private dateStoreService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.userSubscription = this.store.select('auth').subscribe((authState) => {
      this.isAuthenticated = !!authState.user;
    });
  }

  onLogout() {
    this.store.dispatch(new fromAuthAction.Logout());
  }

  onSaveData(): void {
    this.dateStoreService.storeRecipe();
  }

  onFetchData() {
    this.dateStoreService.fetchRecipes().subscribe();
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
