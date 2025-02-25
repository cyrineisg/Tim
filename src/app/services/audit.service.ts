import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';  // Import 'from'
import { switchMap } from 'rxjs/operators';  // Import 'switchMap' from rxjs/operators
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private baseUrl = 'https://timserver.northeurope.cloudapp.azure.com/QalitasWebApi';

  constructor(private http: HttpClient) {}

  // Fetch all audits with Authorization token
  getAllAudits(): Observable<any> {
    return from(this.authService.getToken()).pipe(  // Convert Promise to Observable
      switchMap((token: string | null) => {  // Explicitly type 'token'
        if (!token) {
          console.error("No token found!");
          throw new Error('No token found');
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        console.log('Headers:', headers);
        console.log('Using token for API:', token);
        return this.http.get(`${this.baseUrl}/api/Audits`, { headers });
      })
    );
  }

  // Fetch related processes for an audit
  getAuditProcesses(auditId: number): Observable<any> {
    return from(this.authService.getToken()).pipe(  // Convert Promise to Observable
      switchMap((token: string | null) => {  // Explicitly type 'token'
        if (!token) {
          throw new Error('No token found');
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
        });

        return this.http.get(`${this.baseUrl}/api/Audits/${auditId}/process`, { headers });
      })
    );
  }
  
  getProcessesByAudit(id: string): Observable<any> {
    if (!id) {
      console.error('❌ Invalid Audit ID:', id);
      return of([]); // Return an empty array to avoid undefined errors
    }
  
    return from(this.authService.getToken()).pipe(
      switchMap((token: string | null) => {
        if (!token) {
          throw new Error('No token found');
          return of([]);
        }
  
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        const url = `${this.baseUrl}/api/Audits/${id}/process`;
        console.log(`Fetching processes for audit ID: ${id}`);
        console.log(`Request URL: ${url}`);
        console.log(`Headers:`, headers);

        return this.http.get(url, { headers });
      })
    );
  }
  
}
