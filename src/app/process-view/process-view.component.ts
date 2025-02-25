import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProcessService } from '../services/process.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../services/audit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-process-view',
  templateUrl: './process-view.component.html',
  styleUrls: ['./process-view.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProcessViewComponent implements OnInit {
  auditId: string | null = null;
  processId: string | null = null;
  processDesignation: string = "";
  selectedTab: 'checklist' | 'details' = 'checklist';  // Default tab
  isLoading: boolean = true;
  checklistItems: any[] = [];
  weakness: string = '';
  strength: string = '';
  recommendation: string = '';


  constructor(private route: ActivatedRoute,
    private processService: ProcessService,
    private auditService: AuditService,
    private router: Router) {}

  ngOnInit() {
    this.auditId = this.route.snapshot.paramMap.get('auditId');
    this.processId = this.route.snapshot.paramMap.get('processId'); // Get process ID from URL

    console.log('Audit ID:', this.auditId);
    console.log('Process ID:', this.processId);

    if (this.auditId && this.processId) {
      this.fetchProcessDetails();
      console.log('doneeeeeeeee');
    }
    else{
      console.log('wroooooooong');
    }
  }

  // Method to fetch process details using auditId and processId
  fetchProcessDetails() {
    if (this.auditId && this.processId) {
      console.log('Fetching process details for:', this.auditId, this.processId);

      this.processService.getProcessById(this.auditId, this.processId).subscribe(
        (data: any[]) => {
          console.log('API Response:', data);

          if (data.length > 0) {
            this.processDesignation = data[0].processDesignation || 'No Designation Found';
            this.checklistItems = data.map(item => ({
              question: item.question || 'N/A',
              requirement: item.requirement || 'N/A',
              weighting: item.weighting || 'N/A',
              stateStr: item.stateStr || '',
              conformityStr: item.conformityStr || '',
            }));
          } else {
            console.warn('No data received from API');
            this.processDesignation = 'No Designation Found';
          }

          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching process details:', error);
          this.isLoading = false;
        }
      );

      console.log('Audit ID before API call:', this.auditId);
      console.log('Parsed Audit ID:', parseInt(this.auditId));
      this.auditService.getProcessesByAudit(this.auditId).subscribe(
        (auditData: any[]) => {  // Expecting an array
          console.log('Audit Process Data:', auditData);
      
          // Find the process that matches the current processId
          const currentProcess = auditData.find(p => p.processId === this.processId);
      
          if (currentProcess) {
            this.weakness = currentProcess.weakness || 'No Weakness Provided';
            this.strength = currentProcess.strength || 'No Strength Provided';
            this.recommendation = currentProcess.recommendation || 'No Recommendation Provided';
          } else {
            console.warn('No matching process found for processId:', this.processId);
            this.weakness = 'No Weakness Provided';
            this.strength = 'No Strength Provided';
            this.recommendation = 'No Recommendation Provided';
          }
      
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching audit-related data:', error);
          this.isLoading = false;
        }
      );
      
    } else {
      console.warn('Missing auditId or processId');
    }
  }

  // Method to handle tab switching
  selectTab(tab: 'checklist' | 'details') {
    this.selectedTab = tab;
  }


  //added today
  // Navigate to process-proof page
  goToProcessProof() {
    this.router.navigate(['/process-proof']);  // Navigate to process-proof page
  }
  
}
