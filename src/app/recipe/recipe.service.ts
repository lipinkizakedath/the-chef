import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from '../shopping-list/shopping.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();
  private recipesFromList: Recipe[] = [
    new Recipe(
      'Idely',
      'Organic Kerala Idli and Vada - 2sets',
      'https://www.watscooking.com/icooked/images/dish/large/1412.jpg',
      [new Ingredient('Rice', 20), new Ingredient('Salt', 20)]
    ),
    new Recipe(
      'Idely',
      'Organic Tamilnadu Idli and Vada -3 set',
      'https://static.toiimg.com/thumb/53239358.cms?imgsize=176260&width=800&height=800',
      [new Ingredient('Raw rice', 20), new Ingredient('Salt', 20)]
    ),
  ];

  constructor(private shoppingService: ShoppingService) {}

  getRecipies() {
    return this.recipesFromList.slice();
  }

  addIngredients(ingredients: Ingredient[]) {
    this.shoppingService.addIngredeints(ingredients);
  }
  
}
