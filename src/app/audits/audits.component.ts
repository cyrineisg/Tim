import { Component, OnInit } from '@angular/core';
import { AuditService } from '../services/audit.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AuditsComponent  implements OnInit {

  audits: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  auditId : string= '';
  
  constructor(private auditService: AuditService, private router : Router) {}

  ngOnInit(): void {
    this.fetchAudits();
  }

  fetchAudits(): void {
    this.auditService.getAllAudits().subscribe({
      next: (data) => {
        this.audits = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des audits:', error);
        this.errorMessage = "Impossible de charger les audits.";
        this.isLoading = false;
      }
    });
  }

  selectAudit(auditId: string){
    this.router.navigate(['/process-list', auditId])
  }

}
