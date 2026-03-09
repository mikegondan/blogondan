import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from '@angular/fire/firestore';
import { getAI, getGenerativeModel } from 'firebase/ai';
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
  private firebaseApp = inject(FirebaseApp);
  
  posts$: Observable<BlogPost[]>;
  showForm = signal(false);
  editingPostId = signal<string | null>(null);

  newPostTitle = signal('');
  newPostCategory = signal('Framework');
  newPostReadTime = signal('5 min');
  newPostImage = signal('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');
  newPostExcerpt = signal('');

  showAiModal = signal(false);
  isGeneratingAi = signal(false);
  aiContextPrompt = signal('');

  constructor() {
    const postsCollection = collection(this.firestore, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    this.posts$ = collectionData(q, { idField: 'id' }) as Observable<BlogPost[]>;
  }

  openAiModal() {
    this.aiContextPrompt.set('');
    this.showAiModal.set(true);
  }

  closeAiModal() {
    this.showAiModal.set(false);
    this.isGeneratingAi.set(false);
  }

  async generateWithAi() {
    if (!this.aiContextPrompt().trim()) return;
    
    this.isGeneratingAi.set(true);
    
    try {
      const ai = getAI(this.firebaseApp);
      const model = getGenerativeModel(ai, { model: 'gemini-3-flash-preview' });
      
      const prompt = `Actúa como un experto escritor de artículos para un blog de tecnología y desarrollo de software.
Escribe un fragmento de contenido detallado y profesional usando etiquetas HTML simples (p, strong, ul, li) basado en el siguiente contexto. No devuelvas markdown, solo el código HTML resultante que se pueda inyectar en un editor WYSIWYG.

Contexto del autor: ${this.aiContextPrompt()}`;

      const result = await model.generateContent(prompt);
      const htmlResponse = result.response.text();
      
      const editor = document.getElementById('wysiwyg-editor');
      if (editor) {
        editor.innerHTML = editor.innerHTML + '<br/>' + htmlResponse;
      }
      
      this.closeAiModal();
    } catch (error) {
      console.error("AI Generation Error: ", error);
      alert('Hubo un error al generar el contenido con IA. Verifica que Vertex AI esté habilitado en Firebase y las reglas configuradas.');
      this.isGeneratingAi.set(false);
    }
  }

  toggleForm() {
    const isNowShown = !this.showForm();
    this.showForm.set(isNowShown);
    
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

  execCommand(command: string, value: string = '') {
    document.execCommand(command, false, value);
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
        const postDocRef = doc(this.firestore, `posts/${this.editingPostId()}`);
        await updateDoc(postDocRef, {
          title: this.newPostTitle(),
          excerpt: this.newPostExcerpt(),
          content: content,
          category: this.newPostCategory(),
          readTime: this.newPostReadTime(),
          image: this.newPostImage()
        });
      } else {
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
