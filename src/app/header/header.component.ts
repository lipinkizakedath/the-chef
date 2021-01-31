import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as fromAuthAction from '../auth/store/auth.actions';
import * as fromRecipeActions from '../recipe/store/recipe.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userSubscription: Subscription;

  constructor(
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
    // this.dateStoreService.storeRecipe();
    this.store.dispatch(new fromRecipeActions.StoreRecipe());
  }

  onFetchData() {
    // this.dateStoreService.fetchRecipes().subscribe();
    this.store.dispatch(new fromRecipeActions.FetchRecipes());
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
