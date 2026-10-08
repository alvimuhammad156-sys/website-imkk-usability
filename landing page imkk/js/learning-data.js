export const lessonOrder = [
  { id: 'definisi', title: 'Definisi Usability', message: 'Usability menunjukkan sejauh mana pengguna tertentu dapat mencapai tujuan dengan efektif, efisien, dan puas dalam konteks penggunaan tertentu.' },
  { id: 'pentingnya', title: 'Pentingnya Usability', message: 'Usability mengurangi hambatan pengguna dan dapat memberi manfaat pada produktivitas, biaya dukungan, serta keberhasilan produk.' },
  { id: 'atribut', title: 'Atribut Usability', message: 'Nielsen mengidentifikasi lima atribut: learnability, efficiency, memorability, errors, dan satisfaction.' },
  { id: 'langkah', title: 'Langkah Usability Engineering', message: 'Pahami konteks, tentukan kebutuhan, rancang solusi, lalu evaluasi. Temuan evaluasi memberi masukan untuk iterasi berikutnya.' },
  { id: 'pengukuran', title: 'Metode Pengukuran Usability', message: 'Pilih metode sesuai pertanyaan: usability testing, heuristic evaluation, cognitive walkthrough, SUS, atau wawancara dan observasi.' },
  { id: 'siklus', title: 'Usability Engineering Lifecycle', message: 'Pertimbangkan usability sebelum desain, selama desain, dan setelah rilis dengan mengumpulkan feedback dari penggunaan nyata.' }
];

export const attributes = {
  learnability: {
    title: 'Learnability',
    summary: 'Seberapa cepat pengguna baru dapat menyelesaikan tugas dasar saat pertama kali memakai sistem?',
    evidence: 'Amati keberhasilan dan waktu tugas pada penggunaan pertama.',
    message: 'Learnability: seberapa mudah pengguna baru mempelajari cara menggunakan sistem.'
  },
  efficiency: {
    title: 'Efficiency',
    summary: 'Setelah mahir, seberapa cepat pengguna dapat menyelesaikan tugas?',
    evidence: 'Bandingkan waktu dan langkah yang diperlukan setelah pengguna memahami alur.',
    message: 'Efficiency: seberapa cepat pengguna menyelesaikan tugas setelah memahami sistem.'
  },
  memorability: {
    title: 'Memorability',
    summary: 'Setelah lama tidak menggunakan sistem, seberapa mudah pengguna kembali mahir?',
    evidence: 'Perhatikan apakah pengguna dapat mengingat alur saat kembali setelah jeda.',
    message: 'Memorability: seberapa mudah pengguna mengingat kembali cara menggunakan sistem.'
  },
  errors: {
    title: 'Errors',
    summary: 'Berapa banyak dan seberapa parah kesalahan pengguna, dan seberapa mudah mereka pulih?',
    evidence: 'Catat frekuensi, dampak, dan keberhasilan pemulihan dari kesalahan.',
    message: 'Errors: bagaimana sistem membantu mencegah dan menangani kesalahan pengguna.'
  },
  satisfaction: {
    title: 'Satisfaction',
    summary: 'Seberapa menyenangkan sistem digunakan?',
    evidence: 'Gali persepsi pengguna tentang kenyamanan dan penerimaan pengalaman.',
    message: 'Satisfaction: seberapa nyaman dan menyenangkan sistem digunakan.'
  }
};

export const processSteps = [
  {
    title: 'Pahami konteks penggunaan',
    copy: 'Kenali siapa pengguna, apa yang ingin mereka capai, tugas yang dilakukan, serta lingkungan penggunaan—termasuk faktor teknis, fisik, sosial, budaya, dan organisasi.',
    message: 'Kenali siapa pengguna, tujuan mereka, tugas yang dilakukan, serta lingkungan penggunaannya.'
  },
  {
    title: 'Tentukan kebutuhan',
    copy: 'Turunkan kebutuhan dan persyaratan pengguna dari bukti konteks penggunaan. Kebutuhan sebaiknya dirumuskan terpisah dari solusi yang diusulkan.',
    message: 'Setelah memahami pengguna, tentukan kebutuhan dan tujuan yang harus dipenuhi sistem.'
  },
  {
    title: 'Rancang solusi',
    copy: 'Buat alternatif desain yang menjawab kebutuhan. Libatkan pengguna dan gunakan prototipe untuk membuat keputusan desain dapat diperiksa lebih awal.',
    message: 'Gunakan kebutuhan pengguna sebagai dasar untuk merancang solusi.'
  },
  {
    title: 'Evaluasi desain',
    copy: 'Kumpulkan bukti dari pengguna atau evaluasi ahli, lalu periksa apakah solusi memenuhi kebutuhan dan tujuan usability. Gunakan temuan untuk iterasi berikutnya.',
    message: 'Uji desain untuk mengetahui apakah solusi benar-benar membantu pengguna.'
  }
];

export const methods = {
  testing: 'Usability Testing: kita mengamati pengguna nyata ketika menjalankan tugas.',
  heuristic: 'Heuristic Evaluation: evaluator memeriksa interface berdasarkan prinsip heuristik usability.',
  walkthrough: 'Cognitive Walkthrough: evaluasi berfokus pada kemudahan pengguna baru mempelajari sistem.',
  sus: 'SUS: kuesioner standar untuk mengukur persepsi usability secara kuantitatif.',
  qualitative: 'Wawancara & Observasi: memahami pengalaman, kebutuhan, dan masalah pengguna secara lebih mendalam.'
};

export const lifecyclePhases = [
  {
    title: 'Sebelum desain',
    detail: 'Kenali pengguna, lakukan competitive analysis, dan tetapkan tujuan usability sebelum solusi antarmuka dipilih.',
    message: 'Before Design: usability dipertimbangkan sebelum solusi dirancang.'
  },
  {
    title: 'Selama desain',
    detail: 'Gunakan parallel dan participatory design, koordinasikan keputusan, terapkan guideline dan heuristic analysis, buat prototipe, lakukan empirical testing, lalu iterasikan desain.',
    message: 'During Design: usability dipakai untuk mengevaluasi dan memperbaiki desain selama pengembangan.'
  },
  {
    title: 'Setelah rilis',
    detail: 'Kumpulkan feedback dari field use untuk memahami pengalaman nyata dan menginformasikan perbaikan selanjutnya.',
    message: 'After Release: feedback pengguna menjadi bahan untuk perbaikan berikutnya.'
  }
];

export const guideMessages = {
  welcome: '👋 Hai! Aku KIRA. Selamat datang di ruang belajar Usability Engineering. Yuk, kita eksplor bagaimana sebuah sistem bisa menjadi lebih mudah digunakan.',
  returning: 'Senang melihatmu kembali. Pilih bagian yang ingin kamu pelajari, dan saya akan membantu merangkumnya.',
  start: 'Mari mulai dari dasarnya: apa arti usability dalam konteks penggunaan?',
  attributes: 'Ayo lihat lima atribut usability menurut Jakob Nielsen. Pilih kartu untuk membuka penjelasannya.',
  experience: 'Setelah mempelajari materi ini, coba evaluasi website yang sedang kamu gunakan. Apakah navigasinya mudah dipahami? Apakah kamu tahu posisi kamu sekarang? Apakah setiap interaksi memberikan feedback?'
};

// Short, section-aware guidance shown only when a learner asks KIRA for help.
export const kiraContexts = {
  beranda: {
    prompt: 'Selamat datang! Pilih Mulai Eksplorasi untuk membuka Learning Path dan mulai belajar usability.',
    explanation: 'Pilih “Mulai belajar” untuk memahami usability, lalu lanjutkan enam bagian materi sesuai urutan.',
    example: 'Kamu bisa membaca materi tanpa membuka bantuan KIRA. Pilih KIRA kapan pun ingin ringkasan singkat.'
  },
  definisi: {
    prompt: 'Di sini kita mulai dari dasar. Usability bukan hanya soal tampilan yang bagus, tapi seberapa mudah sistem digunakan untuk mencapai tujuan.',
    explanation: 'Di bagian ini kita mulai dari dasar usability. Fokusnya adalah memahami bagaimana sistem membantu pengguna mencapai tujuannya dengan efektif, efisien, dan memuaskan.',
    example: 'Contoh: pada KRS, mahasiswa perlu menemukan mata kuliah, menyelesaikan pilihan dengan langkah wajar, dan yakin pendaftarannya berhasil.'
  },
  pentingnya: {
    prompt: 'Bayangkan kamu menggunakan aplikasi yang sering membuatmu bingung. Di sinilah usability menjadi penting.',
    explanation: 'Usability penting karena sistem dengan banyak fitur belum tentu mudah digunakan. Perhatikan dampaknya pada pengalaman pengguna.',
    example: 'Contoh: alur pendaftaran yang jelas dapat mengurangi kebingungan dan kesalahan pengguna.'
  },
  atribut: {
    prompt: 'Nielsen membagi usability menjadi lima atribut utama. Coba pilih salah satunya untuk melihat penjelasannya.',
    explanation: 'Nielsen menguraikan usability melalui lima atribut: Learnability, Efficiency, Memorability, Errors, dan Satisfaction.',
    example: 'Saat menilai formulir, amati apakah pengguna baru mudah mempelajarinya, dapat bekerja cepat, mengingat alurnya, menghindari kesalahan, dan merasa nyaman.'
  },
  langkah: {
    prompt: 'Desain yang baik tidak dibuat sekali jadi. Kita perlu memahami pengguna, merancang, mengevaluasi, lalu mengulanginya.',
    explanation: 'Pahami konteks penggunaan, tentukan kebutuhan, rancang solusi, lalu evaluasi apakah solusi membantu pengguna. Ulangi berdasarkan temuan evaluasi.',
    example: 'Untuk peminjaman ruang kampus: kenali peminjam dan kebutuhannya, rancang alur pemesanan, lalu uji dengan mahasiswa.'
  },
  pengukuran: {
    prompt: 'Bagaimana kita tahu sebuah sistem mudah digunakan? Kita bisa mengukurnya dengan beberapa metode evaluasi.',
    explanation: 'Pilih metode sesuai pertanyaan evaluasi: amati pengguna, periksa heuristik, telusuri tugas pengguna baru, ukur persepsi dengan SUS, atau gali pengalaman lewat wawancara dan observasi.',
    example: 'Untuk mengetahui apakah mahasiswa berhasil mengisi KRS, amati tugas dan catat keberhasilan, waktu, serta kesalahan.'
  },
  siklus: {
    prompt: 'Usability tidak berhenti setelah produk dirilis. Feedback pengguna tetap penting untuk pengembangan berikutnya.',
    explanation: 'Pertimbangkan usability sebelum solusi dirancang, evaluasi dan perbaiki desain selama pengembangan, lalu gunakan feedback setelah rilis untuk iterasi berikutnya.',
    example: 'Riset kebutuhan sebelum membuat prototipe, uji prototipe selama desain, lalu pelajari feedback setelah produk digunakan.'
  },
  experience: {
    prompt: 'Sekarang coba perhatikan website ini. Apakah kamu menemukan feedback, affordance, dan hierarchy yang jelas?',
    explanation: 'Setelah mempelajari materi, evaluasi website ini: apakah navigasinya mudah dipahami, apakah posisi kamu terlihat, dan apakah interaksi memberi feedback?',
    example: 'Pilih satu interaksi, misalnya tab metode. Periksa apakah state aktif terlihat dan isi panel berubah setelah pilihan dibuat.'
  },
  tentang: {
    prompt: 'Kamu sedang mengenal IMKK. Mau kembali ke materi usability?',
    explanation: 'Materi pembelajaran dimulai pada bagian Foundations. Gunakan navigasi materi untuk membuka topik yang kamu perlukan.',
    example: 'Kamu dapat melanjutkan urutan dari definisi usability hingga Experience Design.'
  },
  kegiatan: {
    prompt: 'Kamu sedang melihat kegiatan IMKK. Ingin lanjut belajar?',
    explanation: 'Kembali ke daftar materi untuk melanjutkan pembelajaran usability atau memilih topik tertentu.',
    example: 'Mulai dari Foundations untuk memahami efektivitas, efisiensi, dan kepuasan.'
  },
  kontak: {
    prompt: 'Kamu berada di bagian kontak IMKK. Ingin kembali ke materi?',
    explanation: 'Gunakan navigasi materi untuk kembali ke topik usability yang ingin dipelajari.',
    example: 'Evaluation Toolkit membahas cara mengumpulkan bukti dari penggunaan sistem.'
  }
};
