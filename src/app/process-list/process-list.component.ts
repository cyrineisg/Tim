import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AuditService } from 'src/app/services/audit.service';
import { Router } from '@angular/router';
import { ProcessService } from '../services/process.service';

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})

export class ProcessListComponent implements OnInit {
  auditId: string = '';
  token: string = ''; 
  processes: any[] = [];
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private auditService: AuditService, private router: Router, private processService : ProcessService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.auditId = params.get('auditId') || ''; 
      console.log('Received Audit ID:', this.auditId);

      if (this.auditId) {
        this.getProcesses();
      }
    });
  }

  async getProcesses() {
    try {
      this.isLoading = true;
      const observable = this.auditService.getProcessesByAudit(this.auditId);
      
      observable.subscribe(
        (data) => {
          this.processes = data;
          this.isLoading = false;
          console.log('✅ Processes received:', data);
        },
        (error) => {
          console.error('Error fetching processes:', error);
          this.isLoading = false;
        }
      );
    } catch (error) {
      console.error('Error with the authentication request:', error);
      this.isLoading = false;
    }
  }

  viewProcess(auditId: string, processId: string) {
    this.router.navigate(['/process-view', auditId, processId]);  // Navigate to process view
  }
}

