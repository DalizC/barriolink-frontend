import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CertificateRequest {
  certificate_type: string;
  full_name: string;
  address: string;
  email: string;
  send_email?: boolean;
}

export interface CertificateResponse {
  success: boolean;
  message: string;
  certificate_id?: number;
  pdf_url?: string;
  email_sent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl = 'https://chequered-hortense-homeomorphic.ngrok-free.dev/api/certificates';

  constructor(private http: HttpClient) {}

  requestCertificate(data: CertificateRequest): Observable<CertificateResponse> {
    return this.http.post<CertificateResponse>(`${this.apiUrl}/request/`, data);
  }

  downloadPdf(certificateId: number): Observable<Blob> {
    const url = `${this.apiUrl}/${certificateId}/pdf/?download=1`;
    return this.http.get(url, { responseType: 'blob' });
  }

  sendEmail(certificateId: number, email: string): Observable<{detail: string}> {
    return this.http.post<{detail: string}>(`${this.apiUrl}/${certificateId}/send-email/`, { email });
  }
}
