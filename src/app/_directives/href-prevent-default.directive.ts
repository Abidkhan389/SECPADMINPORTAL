import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';


@Directive({
    selector: '[href]',
    host: { '(click)': 'preventDefault($event)' },
})
export class HrefPreventDefaultDirective implements AfterViewInit {
    @Input() href: string;

    constructor() {}
    ngAfterViewInit() {}
    
    preventDefault($event) {
        if (this.href.length === 0 || this.href == '#' ||  this.href == "#") {
            $event.preventDefault();
        }
    }
}