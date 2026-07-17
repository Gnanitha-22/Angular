import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportPdf(title: string, headers: string[], rows: Array<Array<string | number>>): void {
    const doc = new jsPDF({ orientation: 'landscape' });
    const margin = 16;
    const startY = 20;
    const lineHeight = 8;
    const tableWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const columnWidth = tableWidth / Math.max(headers.length, 1);

    doc.setFontSize(16);
    doc.text(title, margin, 14);
    doc.setFontSize(10);

    let y = startY;
    headers.forEach((header, index) => {
      doc.text(String(header), margin + index * columnWidth, y);
    });

    y += lineHeight;
    rows.forEach(row => {
      row.forEach((cell, index) => {
        const text = String(cell);
        doc.text(text, margin + index * columnWidth, y);
      });
      y += lineHeight;
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = startY;
      }
    });

    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    doc.save(fileName);
  }

  exportCsv(fileName: string, headers: string[], rows: Array<Array<string | number>>): void {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
