import { NextResponse } from "next/server"; // Import NextResponse untuk mengirim respons dari API route
import fs from "fs"; // Import modul filesystem untuk menyimpan file
import path from "path"; // Import modul path untuk mengelola path file

export async function POST(req) { // Function untuk menangani request POST
    const formData = await req.formData(); // Ambil data dari form
    const photo = formData.get("photo"); // Ambil file foto
    const prodi = formData.get("prodi"); // Ambil nilai prodi
    const about = formData.get("about"); // Ambil nilai tentang anda
    const cv = formData.get("cv"); // Ambil file CV

  // Simpan file ke folder public/uploads/
    const uploadDir = path.join(process.cwd(), "public/uploads"); // Tentukan direktori upload
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true }); // Buat direktori jika belum ada

    const saveFile = async (file, name) => { // Function untuk menyimpan file
    const bytes = await file.arrayBuffer(); // Baca file sebagai array buffer
    const buffer = Buffer.from(bytes); // Konversi ke buffer
    fs.writeFileSync(path.join(uploadDir, name), buffer); // Simpan file ke direktori
    };

    if (photo) await saveFile(photo, photo.name); // Simpan foto jika ada
    if (cv) await saveFile(cv, cv.name); // Simpan CV jika ada

    return NextResponse.json({ message: "Data berhasil diterima!", prodi, about }); // Kirim respons sukses
}
