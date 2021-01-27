import { ActionReducerMap } from '@ngrx/store';

import * as fromShoppingListReducer from '../shopping-list/store/shoppinglist.reducers';
import * as fromAuthReducer from '../auth/store/auth.reducer';
import * as fromRecipeReducer from '../recipe/store/recipe.reducer';

export interface AppState {
  shoppingList: fromShoppingListReducer.State;
  auth: fromAuthReducer.State;
  recipes: fromRecipeReducer.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingListReducer.shoppingListReducer,
  auth: fromAuthReducer.authReducer,
  recipes: fromRecipeReducer.recipeReducer,
};
