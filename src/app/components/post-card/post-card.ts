import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCard {
  @Input({required: true}) post!: BlogPost;
}
