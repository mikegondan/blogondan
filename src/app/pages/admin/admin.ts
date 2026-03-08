import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, orderBy, query } from '@angular/fire/firestore';
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
    this.showForm.set(!this.showForm());
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

      // Reset form
      this.newPostTitle.set('');
      this.newPostExcerpt.set('');
      this.newPostCategory.set('Framework');
      this.newPostReadTime.set('5 min');
      this.newPostImage.set('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');
      if (editor) editor.innerHTML = '';
      
      this.toggleForm();
    } catch (error) {
      console.error("Error adding document: ", error);
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
