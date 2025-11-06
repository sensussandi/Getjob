import { getServerSession } from "next-auth"; // Ambil session login
import { authOptions } from "../app/api/auth/[...nextauth]/route"; // Path ke nextAuth

// Fungsi helper global untuk mengambil session user login
export async function getSessionUser() { // Mengambil data user dari session login
    const session = await getServerSession(authOptions); // Mendapatkan session menggunakan authOptions

    if (!session || !session.user?.nim) { // Cek apakah session valid
    throw new Error("User belum login"); // Jika tidak valid, lempar error
    }

  return session.user; // Berisi { nim, email, name }
}
