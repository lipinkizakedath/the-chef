import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Recipe } from '../recipe/recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import { Store } from '@ngrx/store';
import * as fromRecipeActions from '../recipe/store/recipe.action';
import * as fromApp from './../store/app.reducer';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecipeResolveService implements Resolve<Recipe[]> {
  constructor(
    private dataStoreService: DataStorageService,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.store.dispatch(new fromRecipeActions.FetchRecipes());
    return this.actions$.pipe(ofType(fromRecipeActions.SET_RECIPES), take(1));
    // const recipe = this.recipeService.getRecipies();
    // if (recipe === null) {
    //   return this.dataStoreService.fetchRecipes();
    // } else {
    //   return recipe;
    // }
  }
}
