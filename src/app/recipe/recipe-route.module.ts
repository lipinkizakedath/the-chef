import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailComponent } from '../recipe/recipe-detail/recipe-detail.component';
import { RecipeComponent } from '../recipe/recipe.component';
import { RecipesStartComponent } from '../recipe/recipes-start/recipes-start.component';
import { RecipeEditComponent } from '../recipe/recipe-edit/recipe-edit.component';
import { RecipeResolveService } from '../recipe/recipe-resolve.service';
import { AuthGuard } from '../auth/auth.guard';

const recipeRoute: Routes = [
  {
    path: 'recipes',
    component: RecipeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RecipesStartComponent },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipeResolveService],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipeResolveService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(recipeRoute)],
  exports: [RouterModule],
})
export class RecipeRouteModule {}
