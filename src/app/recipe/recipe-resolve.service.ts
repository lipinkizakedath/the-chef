import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Recipe } from '../recipe/recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeResolveService implements Resolve<Recipe[]> {
  constructor(
    private dataStoreService: DataStorageService,
    private recipeService: RecipeService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipe = this.recipeService.getRecipies();

    if (recipe === null) {
      return this.dataStoreService.fetchRecipes();
    } else {
      return recipe;
    }
  }
}
