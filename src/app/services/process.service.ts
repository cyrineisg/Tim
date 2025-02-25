import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private apiUrl = 'https://timserver.northeurope.cloudapp.azure.com/QalitasWebApi/api/Audits';
  private token = '9zG1CaHIQCOW1hwxJCEQTVsNZ3W0sR-g7gE4tAsIEYR97RlW5DoipkWhUxgE7ygvsnrxczrWkhgcjeKOooUoacwiavoUMkUcE01KpvPN9VTA7dNvwh0cLOdvOy8Gz7AGKwVxrq0dmH4zZlzmAf2fq9x3DGx9Hy641q5PV6rZUkRqKg_B3So6a5QtvSFfp2W5MPBDIVdTv2GYoqSIyNvKcazMAVas7R5V9J0rq2Th7zGmKWuEb-Zuqef7vp577-fWBg_xnLVdxiP-nEaY8-prfTs4xQOTzJqDXr51bZF-IczoJB-V6PsvmTqmhGRQ9JzH66ZH2bYtaBWJ3sBHMHNEtpG45bM916sqh6Dr5TAzBOkD3793Bph9V14r5sXcPyZbo7Cjivs9A8_6N4GOnjzP5bURJ_BicufJ0pkNJYrlnzRqesbwRb_E5Qi9Um2G2zVx-yxaEbAvZzI2XTt1Wtnram1TxoXfVVoMwAty8VBy_lE'; // 🔴 Remplace par ton token directement

  constructor(private http: HttpClient) {}
 

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`, // Utilise le token initialisé
      'Content-Type': 'application/json'
    });
  }

  getProcessById(auditId: string, processId: string): Observable<any> {
    // Vérifie si le token est défini
    if (!this.token) {
      throw new Error('No token found');
    }

    // Faire la requête API avec l'en-tête Authorization
    return this.http.get(`${this.apiUrl}/${auditId}/checklist/${processId}/process`, { headers: this.getHeaders() });
  }
}
