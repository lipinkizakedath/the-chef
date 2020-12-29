import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { ShoppingService } from './shopping-list/shopping.service';
import { AppRouteModule } from './app-route.module';
import { SlicePipe } from './shared/slice.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataStorageService } from './shared/data-storage.service';
import { AuthComponent } from './auth/auth/auth.component';
import { AuthInterceptor } from './auth/auth.interceptor';

import { RecipeService } from './recipe/recipe.service';
import { RecipeModule } from './recipe/recipe.module';
import { ShoppingModule } from './shopping-list/shopping.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent, AuthComponent],
  imports: [
    BrowserModule,
    AppRouteModule,
    HttpClientModule,
    RecipeModule,
    ShoppingModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
