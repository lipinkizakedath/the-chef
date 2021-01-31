import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';
import * as fromRecipeActions from '../store/recipe.action';
import * as fromShoppingListActions from '../../shopping-list/store/shopping-list.action';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
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
    // this.recipeService.addIngredients(this.recipe.ingredients);
    this.store.dispatch(
      new fromShoppingListActions.AddIngredeints(this.recipe.ingredients)
    );
  }

  deleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new fromRecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
