import { Recipe } from '../../recipe/recipe.model';
import * as fromRecipeActions from './recipe.action';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export function recipeReducer(state = initialState, action: fromRecipeActions.RecipesActions
) {
  switch (action.type) {
    case fromRecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
      };
    default:
      return state;
  }
}
