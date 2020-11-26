import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipesFromList: Recipe[] = [
    new Recipe(
      'Idely',
      'Organic Kerala Idli and Vada - 2sets',
      'https://www.watscooking.com/icooked/images/dish/large/1412.jpg'
    ),
    new Recipe(
      'Idely',
      'Organic Tamilnadu Idli and Vada -3 set',
      'https://www.watscooking.com/icooked/images/dish/large/1412.jpg'
    ),
  ];
  constructor() {}

  ngOnInit(): void {}

  recipeSelectedFromList(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
