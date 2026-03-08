import { Component } from '@angular/core';
import { PostCard, BlogPost } from '../post-card/post-card';

@Component({
  selector: 'app-post-list',
  imports: [PostCard],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css'
})
export class PostList {
  posts: BlogPost[] = [
    {
      title: 'Building Modern Apps with Angular Signals',
      excerpt: 'Discover how Angular Signals can dramatically simplify state management and reactivity in your modern web applications.',
      date: 'Oct 24, 2026',
      readTime: '5 min',
      category: 'Framework',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Mastering the Red and Violet Palette',
      excerpt: 'A deep dive into using vibrant gradients to create stunning, engaging user interfaces that scream quality.',
      date: 'Sep 12, 2026',
      readTime: '8 min',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Why Components are the Future of Web Dev',
      excerpt: 'Component-first architecture has won. Here is how to structure your next massive project for scalability and joy.',
      date: 'Aug 04, 2026',
      readTime: '6 min',
      category: 'Architecture',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];
}
