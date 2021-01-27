import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        // geting the id from route params and return it
        map((params) => {
          return +params['id'];
        }),
        // using the id and setting to id variable and also returning recipe[] from store
        switchMap((id) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        // finding the single recipe from recipe[] using the find method with id and finally subscribing it.
        map((recipeState) => {
          return recipeState.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      )
      .subscribe((recipe) => (this.recipe = recipe));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredients(this.recipe.ingredients);
  }

  deleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
  }
}
