import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { TokenHelper } from 'src/app/_common';
import { ThemeOptions } from '../../../../../theme-options';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {

  faCalendar = faCalendar;
  user=TokenHelper.getUserName()

  toggleDrawer() {
    this.globals.toggleDrawer = !this.globals.toggleDrawer;
  }

  constructor(public globals: ThemeOptions, private router : Router) {
  }

  ngOnInit() {
  }
  Logout()
  {
    TokenHelper.removeAccessToken();
    this.router.navigate(['/login']);
  }

}
