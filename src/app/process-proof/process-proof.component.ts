import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DxHtmlEditorModule } from 'devextreme-angular';

@Component({
  selector: 'app-process-proof',
  templateUrl: './process-proof.component.html',
  styleUrls: ['./process-proof.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, DxHtmlEditorModule]
})
export class ProcessProofComponent implements OnInit {

  @ViewChild('visualizer') canvasRef!: ElementRef<HTMLCanvasElement>;
  files: { name: string, type: string, url: string }[] = []; // Stocke les fichiers ajoutés
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];
  audioContext!: AudioContext;
  analyser!: AnalyserNode;
  dataArray!: Uint8Array;
  canvas!: HTMLCanvasElement;
  canvasCtx!: CanvasRenderingContext2D;
  animationFrameId!: number;

  photos: string[] = [];

  audioStream!: MediaStream;
  isRecording = false;
  isPaused = false;
  comments: { content: string, date: Date }[] = []; // Stocke les commentaires
  commentText: string = ''; // Contenu de l'éditeur de texte

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add('active');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (document.querySelector('.drag-drop-area') as HTMLElement)?.classList.remove('active');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('active');
  
    if (event.dataTransfer?.files.length) {
      Array.from(event.dataTransfer.files).forEach(file => {
        this.files.push({
          name: file.name,
          type: file.type || 'Inconnu',
          url: URL.createObjectURL(file) // Création d'un URL pour l'aperçu
        });
      });
      this.cdr.detectChanges();
    }
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        this.files.push({
          name: file.name,
          type: file.type || 'Inconnu',
          url: URL.createObjectURL(file) // Création d'un URL pour l'aperçu
        });
      });
      this.cdr.detectChanges();
    }
  }
  

    // Ajoute un commentaire
    addComment() {
      if (this.commentText.trim()) {
        this.comments.push({ content: this.commentText, date: new Date() });
        this.commentText = ''; // Réinitialise le champ après ajout
        this.cdr.detectChanges(); // Force la mise à jour de l'affichage
      }
    }

  // Méthode pour démarrer l'enregistrement
  startRecording() {
    this.isRecording = true;
    console.log("Recording started");
  
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.audioStream = stream;  // Stocker le flux pour pouvoir l’arrêter plus tard
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(stream);
      
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      source.connect(this.analyser);
      this.canvas = this.canvasRef.nativeElement;
      this.canvasCtx = this.canvas.getContext('2d')!;
  
      this.visualizeAudio();
  
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
  
      this.mediaRecorder.ondataavailable = event => {
        this.audioChunks.push(event.data);
      };
  
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
  
        this.files.push({
          name: `Enregistrement-${new Date().toISOString()}.webm`,
          type: 'audio/webm',
          url: audioUrl
        });
  
        cancelAnimationFrame(this.animationFrameId);
        this.cdr.detectChanges();
      };
  
      this.mediaRecorder.start();
    }).catch(error => {
      console.error('Erreur d’enregistrement audio:', error);
    });
  }
  

  visualizeAudio() {
    this.animationFrameId = requestAnimationFrame(() => this.visualizeAudio());
    this.analyser.getByteFrequencyData(this.dataArray);
    
    this.canvasCtx.fillStyle = 'black';
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const barWidth = (this.canvas.width / this.dataArray.length) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < this.dataArray.length; i++) {
      barHeight = this.dataArray[i] / 2;
      this.canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
      this.canvasCtx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }

  // Méthode pour arrêter l'enregistrement
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.audioStream.getTracks().forEach(track => track.stop()); // Arrête le micro
      this.isRecording = false;
      this.isPaused = false;
      this.cdr.detectChanges();
    }
  }

  // Mettre en pause l'enregistrement
  pauseRecording() {
    if (this.mediaRecorder && this.isRecording && !this.isPaused) {
      this.mediaRecorder.pause();
      this.isPaused = true;
      this.cdr.detectChanges();
    }
  }

  // Reprendre l'enregistrement
  resumeRecording() {
    if (this.mediaRecorder && this.isRecording && this.isPaused) {
      this.mediaRecorder.resume();
      this.isPaused = false;
      this.cdr.detectChanges();
    }
  }


    
}
