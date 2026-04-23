/**
 * Print Service
 * Handles print layout generation for employee list
 */

import type { Employee } from '~/types/employee'

export const printService = {
  /**
   * Print employee list - opens print dialog with formatted table
   */
  printEmployeeList(employees: Employee[], unitKerja?: string, instansi = 'BIG - Badan Informasi Geospasial') {
    const printWindow = window.open('', '_blank', 'width=1200,height=800')
    if (!printWindow) {
      alert('Popup diblokir. Izinkan popup untuk mencetak.')
      return
    }

    const rows = employees.map((emp, idx) => `
      <tr>
        <td style="text-align:center;border:1px solid #000;padding:4px 6px;">${idx + 1}</td>
        <td style="border:1px solid #000;padding:4px 6px;">${emp.nip}</td>
        <td style="border:1px solid #000;padding:4px 6px;">${emp.nama}</td>
        <td style="text-align:center;border:1px solid #000;padding:4px 6px;">${emp.tempatLahir}</td>
        <td style="border:1px solid #000;padding:4px 6px;">${emp.alamat}</td>
        <td style="text-align:center;border:1px solid #000;padding:4px 6px;">${formatDate(emp.tanggalLahir)}</td>
        <td style="text-align:center;border:1px solid #000;padding:4px 6px;">${emp.jenisKelamin}</td>
        <td style="text-align:center;border:1px solid #000;padding:4px 6px;">${emp.golongan}</td>
        <td style="text-align:center;border:1px solid #000;padding:4px 6px;">${emp.eselon}</td>
        <td style="border:1px solid #000;padding:4px 6px;">${emp.jabatan}</td>
        <td style="text-align:center;border:1px solid #000;padding:4px 6px;">${emp.tempatTugas}</td>
        <td style="text-align:center;border:1px solid #000;padding:4px 6px;">${emp.agama}</td>
        <td style="border:1px solid #000;padding:4px 6px;">${emp.unitKerja}</td>
        <td style="border:1px solid #000;padding:4px 6px;">${emp.noHp}</td>
        <td style="border:1px solid #000;padding:4px 6px;">${emp.npwp}</td>
      </tr>
    `).join('')

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Daftar Pegawai</title>
        <style>
          @page { size: A3 landscape; margin: 15mm; }
          body { font-family: Arial, sans-serif; font-size: 9px; }
          h2 { text-align: center; margin: 0; font-size: 14px; font-weight: bold; }
          h3 { text-align: center; margin: 4px 0 12px; font-size: 12px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th {
            background-color: #1e3a5f;
            color: white;
            border: 1px solid #000;
            padding: 5px 6px;
            text-align: center;
            font-size: 9px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          td { font-size: 9px; vertical-align: top; }
          tr:nth-child(even) td { background-color: #f5f5f5; }
          .footer { margin-top: 20px; text-align: right; font-size: 9px; }
        </style>
      </head>
      <body>
        <h2>DAFTAR PEGAWAI</h2>
        <h3>${instansi}${unitKerja ? '<br>' + unitKerja : ''}</h3>
        <table>
          <thead>
            <tr>
              <th style="width:25px">No</th>
              <th style="width:110px">NIP</th>
              <th style="width:120px">Nama</th>
              <th style="width:80px">Tempat Lahir</th>
              <th style="width:130px">Alamat</th>
              <th style="width:65px">Tgl Lahir</th>
              <th style="width:25px">L/P</th>
              <th style="width:35px">Gol</th>
              <th style="width:40px">Eselon</th>
              <th style="width:130px">Jabatan</th>
              <th style="width:70px">Tempat Tugas</th>
              <th style="width:50px">Agama</th>
              <th style="width:100px">Unit Kerja</th>
              <th style="width:80px">No. HP</th>
              <th style="width:100px">NPWP</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div class="footer">
          Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
          &nbsp;&nbsp;|&nbsp;&nbsp; Total: ${employees.length} pegawai
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  },
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
