import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: { webPath: string }[] = [];

  public async addNewToGallery() {
    try {
      // Vérifier si l'appareil photo est supporté sur le web
      const isAvailable = (await Camera.checkPermissions()).camera === 'granted';

      if (!isAvailable) {
        console.warn("La caméra n'est pas disponible sur le web. Utilisation de l'input file.");
        document.getElementById('fileInput')?.click();
        return;
      }

      // Capture la photo
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt, // Permet de choisir entre galerie et appareil photo
        quality: 100
      });

      if (capturedPhoto.webPath) {
        this.photos.push({ webPath: capturedPhoto.webPath });
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo :', error);
    }
  }
}

// Ajout d'un input file caché pour le web
document.body.innerHTML += `<input id="fileInput" type="file" accept="image/*" style="display: none;" />`;
document.getElementById('fileInput')?.addEventListener('change', (event: any) => {
  const file = event.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    console.log('Image sélectionnée :', imageUrl);
  }
});
