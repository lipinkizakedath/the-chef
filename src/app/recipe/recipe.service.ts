import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from '../shopping-list/shopping.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();
  private recipesFromList: Recipe[] = [
    // new Recipe(
    //   'Idely',
    //   'Organic Kerala Idli and Vada - 2sets',
    //   'https://static.toiimg.com/thumb/msid-70724033,imgsize-935456,width-800,height-600,resizemode-75/70724033.jpg',
    //   [new Ingredient('Rice', 20), new Ingredient('Salt', 20)]
    // ),
    // new Recipe(
    //   'Idely',
    //   'Organic Tamilnadu Idli and Vada -3 set',
    //   'https://static.toiimg.com/thumb/53239358.cms?imgsize=176260&width=800&height=800',
    //   [new Ingredient('Raw rice', 20), new Ingredient('Salt', 20)]
    // ),
  ];

  constructor(
    private shoppingService: ShoppingService,
    private router: Router
  ) {}

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
    this.shoppingService.addIngredeints(ingredients);
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
