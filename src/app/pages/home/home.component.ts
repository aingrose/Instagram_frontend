import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstaComponent } from "../../components/sidebar/Instagram/insta/insta.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
