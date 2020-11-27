import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';

// This custome directive is changing the open class in the dropdown toggle to true or false.
// we just need to add the selector in the required elements where ever its required

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  constructor(private elementRef: ElementRef) {}

  // the host binder is manipulating the open class to true or false
  @HostBinding('class.open') isOpen = false;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    // this will keep it open and will close it only if you click the button again.
    // this.isOpen = !this.isOpen;

    // this method will open the dropdown and close when you click any where outside the button
    this.isOpen = this.elementRef.nativeElement.contains(event.target)
      ? !this.isOpen
      : false;
  }
}
