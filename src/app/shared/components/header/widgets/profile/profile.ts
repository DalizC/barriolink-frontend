import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

import { profile } from "../../../../data/header";
import { FeatherIcon } from "../../../ui/feather-icon/feather-icon";
import { AuthService } from "../../../../../core/services/auth.service";

@Component({
  selector: "app-profile",
  imports: [RouterModule, FeatherIcon, CommonModule],
  templateUrl: "./profile.html",
  styleUrl: "./profile.scss",
})
export class Profile {
  private router = inject(Router);
  private authService = inject(AuthService);

  public profile = profile;
  public currentUser$ = this.authService.currentUser$;

  logOut() {
    this.authService.logout();
  }
}
