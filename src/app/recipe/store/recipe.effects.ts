import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRecipeActions from '../store/recipe.action';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';

@Injectable()
export class RecipeEffects {
  baseUrl = 'https://the-chef-9f6dd-default-rtdb.firebaseio.com/';

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

  constructor(private action$: Actions, private http: HttpClient) {}
}
