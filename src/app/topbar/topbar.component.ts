import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  goto() {
    if (this.router.url === "/user") {
      this.location.back();
    } else {
      this.router.navigate(["user"]);
    }
  }

}
