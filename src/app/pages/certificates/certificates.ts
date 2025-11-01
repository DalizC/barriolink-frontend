import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-certificates",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./certificates.html",
  styleUrl: "./certificates.scss",
})
export class Certificates {
  certificates = [
    { id: 1, name: "Certificado de Plomería", issuer: "Instituto Técnico", date: "2023-05-15", status: "Vigente" },
    { id: 2, name: "Electricidad Residencial", issuer: "Colegio de Electricistas", date: "2022-11-20", status: "Vigente" },
    { id: 3, name: "Jardinería Profesional", issuer: "Asociación de Jardineros", date: "2024-01-10", status: "Vigente" },
    { id: 4, name: "Seguridad Industrial", issuer: "OSHA", date: "2021-08-30", status: "Vencido" },
  ];
}