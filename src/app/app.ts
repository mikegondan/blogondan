import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { PostList } from './components/post-list/post-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, PostList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mblog');
}
