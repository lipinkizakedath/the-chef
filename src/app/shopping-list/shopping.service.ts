import { EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingService {
  ingredientChanged = new EventEmitter<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomatto', 10),
  ];

  addIngredient(ingredeint: Ingredient) {
    this.ingredients.push(ingredeint);
    this.ingredientChanged.emit(this.ingredients.slice());
  }

  getIngredient() {
    return this.ingredients.slice();
  }

  addIngredeints(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientChanged.emit(this.ingredients.slice());
  }
}
