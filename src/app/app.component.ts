import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as IonIcons from 'ionicons/icons';
import { DxHtmlEditorModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, DxHtmlEditorModule, CommonModule],
})
export class AppComponent {
  constructor() 
  {     
    addIcons(IonIcons);
  }
}
