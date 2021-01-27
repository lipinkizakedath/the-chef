import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipe/recipe.service';
import { Recipe } from '../recipe/recipe.model';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromRecipeActions from '../recipe/store/recipe.action';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  baseUrl = 'https://the-chef-9f6dd-default-rtdb.firebaseio.com/';

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

  storeRecipe() {
    const recipe = this.recipeService.getRecipies();
    this.http
      .put(this.baseUrl + 'recipes.json', recipe)
      .subscribe((data) => console.log(data));
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.baseUrl + 'recipes.json').pipe(
      map((recipe) => {
        return recipe.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),

      tap((recipes: Recipe[]) => {
        // this.recipeService.setRecipe(recipes);
        this.store.dispatch(new fromRecipeActions.SetRecipes(recipes));
      })
    );
  }
}
