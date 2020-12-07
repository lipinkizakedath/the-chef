import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  constructor(private dateStoreService: DataStorageService) { }

  ngOnInit(): void { }

  onSaveData(): void {
    this.dateStoreService.storeRecipe();
  }

  onFetchData() {
    this.dateStoreService.fetchRecipes().subscribe();
  }

}
