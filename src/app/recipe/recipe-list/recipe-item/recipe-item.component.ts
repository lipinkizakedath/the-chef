import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent implements OnInit {
  // recipeItem receiving date from recipe-list component
  @Input() recipeItem: Recipe;
  @Input() index: number;

  constructor() {}

  ngOnInit(): void {}
}
