import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';
import { Store } from '@ngrx/store';
import * as fromShoppingListActions from '../shopping-list/store/shopping-list.action';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();
  private recipesFromList: Recipe[] = [];

  constructor(private router: Router, private store: Store<fromApp.AppState>) {}

  setRecipe(recipe: Recipe[]) {
    this.recipesFromList = recipe;
    this.recipeChanged.next(this.recipesFromList.slice());
  }

  getRecipies() {
    return this.recipesFromList.slice();
  }

  getRecipe(index: number) {
    return this.recipesFromList[index];
  }

  addIngredients(ingredients: Ingredient[]) {
    this.store.dispatch(
      new fromShoppingListActions.AddIngredeints(ingredients)
    );
  }

  addRecipie(recipe: Recipe) {
    this.recipesFromList.push(recipe);
    this.recipeChanged.next(this.recipesFromList.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipesFromList[index] = newRecipe;
    this.recipeChanged.next(this.recipesFromList.slice());
  }

  deleteRecipe(index: number) {
    this.recipesFromList.splice(index, 1);
    this.recipeChanged.next(this.recipesFromList.slice());
    this.router.navigate(['../']);
  }
}
