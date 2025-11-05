import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LayoutService {
  public closeSidebar: boolean = true;

  public margin: number = 0;
  public scrollMargin: number = -4500;

  /*
  Layout configuration
  values: {
    layout_type: "box-layout" | "full-layout",
    layout_version: "light-only" | "dark-only" | "light-dark",
    sidebar_type: "compact-wrapper" | "horizontal-wrapper",
    icon: "stroke-svg" | "fill-svg",
    layout: string
  }
  */
  public config = {
    settings: {
      layout_type: "full-layout",
      layout_version: "light-only",
      sidebar_type: "horizontal-wrapper",
      icon: "stroke-svg",
      layout: "container-lg",
    },
    color: {
      primary: "#7366ff",
      secondary: "#838383",
    },
  };
}
