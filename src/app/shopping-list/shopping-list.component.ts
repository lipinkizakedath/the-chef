import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from './shopping.service';
import { select, Store } from '@ngrx/store';
import { AddIngredeints } from './store/shopping-list.action';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients$: Observable<{ ingredients: Ingredient[] }>;
  idChangedSub: Subscription;

  constructor(
    private shoppingService: ShoppingService,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  ngOnInit() {
    this.ingredients$ = this.store.select('shoppingList');
    // this.ingredients = this.shoppingService.getIngredients();
    // this.idChangedSub = this.shoppingService.ingredientChanged.subscribe(
    //   (ingreident: Ingredient[]) => {
    //     this.ingredients = ingreident;
    //   }
    // );
  }
  ngOnDestroy(): void {
    // this.idChangedSub.unsubscribe();
  }

  onEditItem(index: number) {
    this.shoppingService.startedEditing.next(index);
  }
}
