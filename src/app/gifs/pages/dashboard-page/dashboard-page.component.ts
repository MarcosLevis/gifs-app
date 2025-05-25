import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'dashboard-page',
  imports: [RouterOutlet],
  templateUrl: './dashboard-page.component.html',
})
export default class DashboardPageComponent { }
