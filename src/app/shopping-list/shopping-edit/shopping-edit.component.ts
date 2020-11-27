import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from '../shopping.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit {
  // Local reference value called from template
  @ViewChild('nameInput') nameInputRef: ElementRef;
  @ViewChild('amountInput') ampuntInputRef: ElementRef;

  // Emitting value to shopping list parent component
  @Output() ingredientAdded = new EventEmitter<Ingredient>();
  constructor(private shoppingSerive: ShoppingService) {}

  ngOnInit(): void {}

  onAddItem() {
    const ingName = this.nameInputRef.nativeElement.value;
    const ingAmt = this.ampuntInputRef.nativeElement.value;
    const newIngredient = new Ingredient(ingName, ingAmt);
    // this.ingredientAdded.emit(newIngredient);
    this.shoppingSerive.addIngredient(newIngredient);
  }
}
