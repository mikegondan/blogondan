import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCard } from '../post-card/post-card';
import { BlogPost } from '../../models/blog-post.model';
import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostCard],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css'
})
export class PostList {
  private firestore = inject(Firestore);
  posts$: Observable<BlogPost[]>;

  constructor() {
    const postsCollection = collection(this.firestore, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    // collectionData automatically handles the subscription and unsubscription for the view
    this.posts$ = collectionData(q, { idField: 'id' }) as Observable<BlogPost[]>;
  }
}

