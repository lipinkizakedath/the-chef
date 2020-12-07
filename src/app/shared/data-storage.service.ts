import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipe/recipe.service';
import { Recipe } from '../recipe/recipe.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  baseUrl = 'https://the-chef-9f6dd-default-rtdb.firebaseio.com/';

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipe() {
    const recipe = this.recipeService.getRecipies();
    this.http.put(this.baseUrl + 'recipes.json', recipe).subscribe(
      data => console.log(data)
    );
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.baseUrl + 'recipes.json').pipe(
      // mapping empty array if ingredient is empty
      map(recipe => {
        return recipe.map(recipe => {
          return {
            ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      // setting the recipe to the recipe list array
      tap(recipes => {
        this.recipeService.setRecipe(recipes);
      })
    )
  }

}
