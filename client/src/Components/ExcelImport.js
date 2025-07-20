import React from 'react';
import * as XLSX from 'xlsx';

function ExcelImport({ onImport }) {
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
            onImport(json);
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 500, marginRight: 10 }}>Import Excel:</label>
            <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
        </div>
    );
}

export default ExcelImport;
