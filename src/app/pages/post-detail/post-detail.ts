import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, switchMap } from 'rxjs';
import { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css'
})
export class PostDetailComponent {
  private firestore = inject(Firestore);
  private route = inject(ActivatedRoute);

  post$: Observable<BlogPost | undefined>;

  constructor() {
    this.post$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        const postRef = doc(this.firestore, `posts/${id}`);
        return docData(postRef, { idField: 'id' }) as Observable<BlogPost>;
      })
    );
  }
}
