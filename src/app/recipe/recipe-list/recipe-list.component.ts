import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe(
      'Idely',
      'nfsldnflnksf',
      'https://www.watscooking.com/icooked/images/dish/large/1412.jpg'
    ),
    new Recipe(
      'Idely',
      'nfsldnflnksf',
      'https://www.watscooking.com/icooked/images/dish/large/1412.jpg'
    ),
  ];
  constructor() {}

  ngOnInit(): void {}
}
