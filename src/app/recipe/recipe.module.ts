import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeComponent } from '../recipe/recipe.component';
import { RecipeListComponent } from '../recipe/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from '../recipe/recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from '../recipe/recipe-list/recipe-item/recipe-item.component';
import { RecipesStartComponent } from '../recipe/recipes-start/recipes-start.component';
import { RecipeEditComponent } from '../recipe/recipe-edit/recipe-edit.component';
import { RecipeRouteModule } from './recipe-route.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RecipeComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipesStartComponent,
    RecipeEditComponent,
  ],
  imports: [CommonModule, RecipeRouteModule, RecipeRouteModule, SharedModule],
  exports: [],
})
export class RecipeModule {}
