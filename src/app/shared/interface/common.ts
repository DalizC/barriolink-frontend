export interface ICardToggleOptions {
  id: number;
  title: string;
  /** Optional HTML snippet to render an icon before the title (trusted content) */
  iconHtml?: string;
  /** Optional CSS class to apply to the dropdown item */
  itemClass?: string;
}