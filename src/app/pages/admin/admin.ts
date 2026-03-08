import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent {
  private firestore = inject(Firestore);
  
  posts$: Observable<BlogPost[]>;
  showForm = signal(false);
  editingPostId = signal<string | null>(null);

  // Form signals
  newPostTitle = signal('');
  newPostCategory = signal('Framework');
  newPostReadTime = signal('5 min');
  newPostImage = signal('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');
  newPostExcerpt = signal('');

  constructor() {
    const postsCollection = collection(this.firestore, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    this.posts$ = collectionData(q, { idField: 'id' }) as Observable<BlogPost[]>;
  }

  toggleForm() {
    const isNowShown = !this.showForm();
    this.showForm.set(isNowShown);
    
    // If hiding the form manually via Cancel, reset fields
    if (!isNowShown) {
      this.resetForm();
    }
  }

  editPost(post: BlogPost) {
    this.editingPostId.set(post.id ?? null);
    this.newPostTitle.set(post.title);
    this.newPostCategory.set(post.category);
    this.newPostReadTime.set(post.readTime);
    this.newPostImage.set(post.image);
    this.newPostExcerpt.set(post.excerpt);
    
    this.showForm.set(true);
    
    // Needs a slight delay for the *ngIf DOM element to be created before we set innerHTML
    setTimeout(() => {
      const editor = document.getElementById('wysiwyg-editor');
      if (editor) {
        editor.innerHTML = post.content;
      }
    }, 0);
  }

  resetForm() {
    this.editingPostId.set(null);
    this.newPostTitle.set('');
    this.newPostExcerpt.set('');
    this.newPostCategory.set('Framework');
    this.newPostReadTime.set('5 min');
    this.newPostImage.set('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');
    const editor = document.getElementById('wysiwyg-editor');
    if (editor) editor.innerHTML = '';
  }

  execCommand(command: string) {
    document.execCommand(command, false, '');
  }

  async savePost() {
    const editor = document.getElementById('wysiwyg-editor');
    let content = '';
    if (editor) {
      content = editor.innerHTML;
    }

    if (!this.newPostTitle().trim() || !content.trim()) {
      alert('Por favor, completa el título y el contenido WYSIWYG.');
      return;
    }

    try {
      if (this.editingPostId()) {
        // Update existing document
        const postDocRef = doc(this.firestore, `posts/${this.editingPostId()}`);
        await updateDoc(postDocRef, {
          title: this.newPostTitle(),
          excerpt: this.newPostExcerpt(),
          content: content,
          category: this.newPostCategory(),
          readTime: this.newPostReadTime(),
          image: this.newPostImage()
          // Note: createdAt is unchanged on purpose for edit
        });
      } else {
        // Create new document
        const postsCollection = collection(this.firestore, 'posts');
        await addDoc(postsCollection, {
          title: this.newPostTitle(),
          excerpt: this.newPostExcerpt(),
          content: content,
          category: this.newPostCategory(),
          readTime: this.newPostReadTime(),
          image: this.newPostImage(),
          createdAt: Date.now()
        });
      }

      this.resetForm();
      this.showForm.set(false);
    } catch (error) {
      console.error("Error saving document: ", error);
      alert('Error guardando la entrada.');
    }
  }

  async deletePost(id: string | undefined) {
    if (!id) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar esta entrada?')) {
      try {
        const postDocRef = doc(this.firestore, `posts/${id}`);
        await deleteDoc(postDocRef);
      } catch (error) {
        console.error("Error removing document: ", error);
        alert('Error al eliminar la entrada.');
      }
    }
  }
}
