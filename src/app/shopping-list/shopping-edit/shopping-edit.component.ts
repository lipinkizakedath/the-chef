import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Store } from '@ngrx/store';
import * as fromShoppingListActions from '../store/shopping-list.action';
import * as fromApp  from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') shoppingListForm: NgForm;
  editMode = false;
  subscription: Subscription;
  editedItem: Ingredient;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.subscription = this.store
      .select('shoppingList')
      .subscribe((stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;
          this.shoppingListForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        } else {
          this.editMode = false;
        }
      });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(
        new fromShoppingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      this.store.dispatch(
        new fromShoppingListActions.AddIngredeint(newIngredient)
      );
    }
    this.editMode = false;
    form.reset();
  }

  onDelete() {
    this.store.dispatch(
      new fromShoppingListActions.DeleteIngredient()
    );
    this.resetForm();
  }

  resetForm() {
    this.editMode = false;
    this.shoppingListForm.reset();
    this.store.dispatch(new fromShoppingListActions.StopEdit());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new fromShoppingListActions.StopEdit());
  }
}
