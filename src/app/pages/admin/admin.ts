import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BlogPost {
  id: string;
  title: string;
  createdAt: Date;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent {
  posts = signal<BlogPost[]>([
    { id: '1', title: 'Primera entrada del blog', createdAt: new Date() },
    { id: '2', title: 'Cómo dominar Angular', createdAt: new Date() },
  ]);

  showForm = signal(false);
  newPostTitle = signal('');

  toggleForm() {
    this.showForm.set(!this.showForm());
  }

  execCommand(command: string) {
    document.execCommand(command, false, '');
  }

  savePost() {
    // Collect HTML from WYSIWYG div
    const editor = document.getElementById('wysiwyg-editor');
    let content = '';
    if (editor) {
      content = editor.innerHTML;
    }

    if (!this.newPostTitle().trim() || !content.trim()) {
      alert('Por favor, completa el título y el contenido.');
      return;
    }

    this.posts.update(currentPosts => [
      {
        id: Math.random().toString(),
        title: this.newPostTitle(),
        createdAt: new Date(),
      },
      ...currentPosts
    ]);

    // Reset form
    this.newPostTitle.set('');
    if (editor) editor.innerHTML = '';
    this.toggleForm();
  }
}
