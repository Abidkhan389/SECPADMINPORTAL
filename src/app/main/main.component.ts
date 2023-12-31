import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  heading:'Main Page';
  subheading = '';
  icon = 'pe-7s-plane icon-gradient bg-tempting-azure';
  constructor() { }

  ngOnInit(): void {
  }

}
