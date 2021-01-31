import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRecipeActions from '../store/recipe.action';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipeEffects {
  baseUrl = 'https://the-chef-9f6dd-default-rtdb.firebaseio.com/';

  @Effect({ dispatch: false })
  storeRecipe = this.action$.pipe(
    ofType(fromRecipeActions.STORE_RECIPE),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipeState]) => {
      return this.http.put(this.baseUrl + 'recipes.json', recipeState.recipes);
    })
  );

  @Effect()
  fetchRecipes = this.action$.pipe(
    ofType(fromRecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(this.baseUrl + 'recipes.json');
    }),
    map((recipe) => {
      return recipe.map((recipe) => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        };
      });
    }),
    map((recipes) => {
      return new fromRecipeActions.SetRecipes(recipes);
    })
  );

  constructor(
    private action$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
