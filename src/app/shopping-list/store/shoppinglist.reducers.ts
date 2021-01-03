import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import * as fromShoppingListActions from './shopping-list.action';

const initialState = {
  ingredients: [new Ingredient('Apple', 5), new Ingredient('Tomatto', 10)],
};

export function shoppingListReducer(
  state = initialState,
  action: fromShoppingListActions.ShooppingListActions
) {
  switch (action.type) {
    case fromShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };

    case fromShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };
    default:
      return state;
  }
}
