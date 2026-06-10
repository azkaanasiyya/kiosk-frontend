// ─────────────────────────────────────────────────────────────────────────────
// translations.ts
// Semua teks UI dalam dua bahasa.
// Tambahkan key baru di sini saat ada halaman/teks baru.
// ─────────────────────────────────────────────────────────────────────────────

export type Language = "id" | "en";

export const translations = {
  id: {
    // ── Start Page ───────────────────────────────────────────────────────────
    start: {
      startOrder:   "Mulai Pesanan",
      tapToOrder:   "Sentuh untuk memesan",
      scanGift:     "Pindai Hadiah",
      storeName:    "Toko Kopi Jaya",
      language:     "Bahasa",
      accessibility:"Akses",
      halalNote:    "Semua menu kami dibuat dari bahan baku halal, berkualitas, dan ramah lingkungan.",
    },

    // ── Service Type Page ─────────────────────────────────────────────────────
    serviceType: {
      title:    "Makan di sini atau bawa pulang?",
      dineIn:   "Makan di Sini",
      takeAway: "Bawa Pulang",
      language: "Bahasa",
    },

    // ── Menu Page ─────────────────────────────────────────────────────────────
    menu: {
      orderNow:      "Pesan Sekarang",
      recommendations:"Rekomendasi",
      filterHint:    "Gunakan filter berikut untuk memudahkan pencarian",
      viewOrder:     "Lihat Pesanan Saya",
      restartOrder:  "Mulai dari Awal",
      halalNote:     "Semua menu kami hanya dibuat dari bahan baku yang mengikuti prosedur pengolahan yang halal, berkualitas, dan ramah lingkungan untuk memastikan menu pilihanmu aman untuk kamu konsumsi.",
      accessibility: "Aksesibilitas",
    },

    // ── Product Detail Page ───────────────────────────────────────────────────
    productDetail: {
      additionalItems: "Kandungan Tambahan",
      removeAll:       "Hapus Semua",
      yourChanges:     "Perubahan Anda",
      total:           "Total",
      cancel:          "Batal",
      addToOrder:      "Tambah pada Pesanan",
    },

    // ── Success Screen ────────────────────────────────────────────────────────
    success: {
      title:    "Menu ditambahkan\ndalam pesanan",
      subtitle: "Jumlah Total telah diperbarui",
    },

    // ── Recommendation Page ───────────────────────────────────────────────────
    recommendation: {
      title: "Bolehkah kami menyarankan",
      skip:  "Tidak",
    },

    // ── Cart Page ─────────────────────────────────────────────────────────────
    cart: {
      title:       "Pesanan Anda",
      empty:       "Belum ada pesanan",
      delete:      "Hapus",
      subTotal:    "Sub-total",
      total:       "Total",
      addMore:     "Tambah\nPesanan",
      checkout:    "Selesaikan Pesanan",
      restartOrder:"Mulai dari Awal",
      halalNote:   "Semua menu kami hanya dibuat dari bahan baku yang mengikuti prosedur pengolahan yang halal, berkualitas, dan ramah lingkungan.",
      accessibility:"Aksesibilitas",
    },

    // ── Payment Method Page ───────────────────────────────────────────────────
    payment: {
      title:         "Di mana Anda\ningin membayar",
      payHere:       "Bayar di Sini",
      payHereSub:    "QRIS / Kartu Debit / Kredit",
      or:            "Atau",
      payAtCashier:  "Bayar di Kasir",
      back:          "Kembali",
      restartOrder:  "Mulai dari Awal",
      accessibility: "Aksesibilitas",
      halalNote:     "Semua menu kami hanya dibuat dari bahan baku yang mengikuti prosedur pengolahan yang halal, berkualitas, dan ramah lingkungan.",
    },

    // ── Pick Table Number Page ────────────────────────────────────────────────
    pickTable: {
      title:    "Silakan ambil nomor\nmeja Anda di konter\ndepan",
      continue: "Sudah, Lanjutkan",
      restartOrder:  "Mulai dari Awal",
      accessibility: "Aksesibilitas",
      halalNote:     "Semua menu kami hanya dibuat dari bahan baku yang mengikuti prosedur pengolahan yang halal, berkualitas, dan ramah lingkungan.",
    },

    // ── Input Table Number Page ───────────────────────────────────────────────
    inputTable: {
      title:   "Masukkan Nomor\nMeja",
      confirm: "Konfirmasi Nomor Meja",
    },

    // ── QRIS Page ─────────────────────────────────────────────────────────────
    qris: {
      title:        "Scan untuk Membayar",
      subtitle:     "Gunakan aplikasi dompet digital Anda",
      totalLabel:   "Total Pembayaran",
      tableLabel:   "Nomor Meja",
      orderLabel:   "No. Order",
      successLabel: "Pembayaran Berhasil!",
      devSimulate:  "[Dev] Simulasi Pembayaran Berhasil",
      restartOrder:  "Mulai dari Awal",
      accessibility: "Aksesibilitas",
      halalNote:     "Semua menu kami hanya dibuat dari bahan baku yang mengikuti prosedur pengolahan yang halal, berkualitas, dan ramah lingkungan.",
    },

    // ── Receipt Page ──────────────────────────────────────────────────────────
    receipt: {
      titlePaid:      "Pesanan Anda sedang\ndisiapkan, silakan ambil\nstruk Anda",
      titlePending:   "Tunjukkan struk ini\nke kasir untuk\nmenyelesaikan pembayaran",
      yourOrder:      "Pesanan Anda",
      pendingBadge:   "Belum Lunas — Bayar di Kasir",
      orderNo:        "No. Order",
      tableNo:        "Nomor Meja",
      type:           "Tipe",
      dineIn:         "Makan di Sini",
      takeAway:       "Bawa Pulang",
      subTotal:       "Sub-total",
      total:          "Total",
      print:          "Cetak Struk",
      done:           "Selesai",
      restartOrder:   "Mulai dari Awal",
      accessibility:  "Aksesibilitas",
      halalNote:      "Semua menu kami hanya dibuat dari bahan baku yang mengikuti prosedur pengolahan yang halal, berkualitas, dan ramah lingkungan.",
    },

    // ── Language Selector ─────────────────────────────────────────────────────
    // ── Member Page ───────────────────────────────────────────────────────────
    member: {
      title:              "Punya akun member?",
      subtitle:           "Masukkan nomor HP untuk mendapatkan poin",
      checkButton:        "Cek Nomor",
      checking:           "Memeriksa...",
      memberFound:        "Member ditemukan!",
      memberNotFound:     "Nomor tidak terdaftar",
      memberNotFoundHint: "Daftar member di aplikasi Kopi Jaya",
      continueButton:     "Lanjutkan",
      skip:               "Lewati, saya tidak punya member",
      restartOrder:       "Mulai dari Awal",
      accessibility:      "Aksesibilitas",
    },

    languageSelector: {
      indonesia: "Indonesia",
      english:   "English",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // ENGLISH
  // ───────────────────────────────────────────────────────────────────────────
  en: {
    start: {
      startOrder:    "Start Order",
      tapToOrder:    "Tap to order",
      scanGift:      "Scan Gift",
      storeName:     "Kopi Jaya Store",
      language:      "Language",
      accessibility: "Access",
      halalNote:     "All our menus are made from halal, high-quality, and eco-friendly ingredients.",
    },

    serviceType: {
      title:    "Dine in or take away?",
      dineIn:   "Dine In",
      takeAway: "Take Away",
      language: "Language",
    },

    menu: {
      orderNow:       "Order Now",
      recommendations:"Recommendations",
      filterHint:     "Use the filters below to narrow your search",
      viewOrder:      "View My Order",
      restartOrder:   "Start Over",
      halalNote:      "All our menus are only made from ingredients that follow halal processing procedures, are high-quality, and eco-friendly to ensure your chosen menu is safe for you to consume.",
      accessibility:  "Accessibility",
    },

    productDetail: {
      additionalItems: "Additional Items",
      removeAll:       "Remove All",
      yourChanges:     "Your Changes",
      total:           "Total",
      cancel:          "Cancel",
      addToOrder:      "Add to Order",
    },

    success: {
      title:    "Item added\nto your order",
      subtitle: "Total amount has been updated",
    },

    recommendation: {
      title: "May we suggest",
      skip:  "No Thanks",
    },

    cart: {
      title:        "Your Order",
      empty:        "No items yet",
      delete:       "Remove",
      subTotal:     "Sub-total",
      total:        "Total",
      addMore:      "Add\nMore",
      checkout:     "Complete Order",
      restartOrder: "Start Over",
      halalNote:    "All our menus are only made from ingredients that follow halal processing procedures, are high-quality, and eco-friendly.",
      accessibility:"Accessibility",
    },

    payment: {
      title:         "Where would you\nlike to pay?",
      payHere:       "Pay Here",
      payHereSub:    "QRIS / Debit / Credit Card",
      or:            "Or",
      payAtCashier:  "Pay at Cashier",
      back:          "Back",
      restartOrder:  "Start Over",
      accessibility: "Accessibility",
      halalNote:     "All our menus are only made from ingredients that follow halal processing procedures, are high-quality, and eco-friendly.",
    },

    pickTable: {
      title:         "Please get your\ntable number from\nthe front counter",
      continue:      "Got it, Continue",
      restartOrder:  "Start Over",
      accessibility: "Accessibility",
      halalNote:     "All our menus are only made from ingredients that follow halal processing procedures, are high-quality, and eco-friendly.",
    },

    inputTable: {
      title:   "Enter Your\nTable Number",
      confirm: "Confirm Table Number",
    },

    qris: {
      title:        "Scan to Pay",
      subtitle:     "Use your digital wallet app",
      totalLabel:   "Total Payment",
      tableLabel:   "Table Number",
      orderLabel:   "Order No.",
      successLabel: "Payment Successful!",
      devSimulate:  "[Dev] Simulate Payment Success",
      restartOrder:  "Start Over",
      accessibility: "Accessibility",
      halalNote:     "All our menus are only made from ingredients that follow halal processing procedures, are high-quality, and eco-friendly.",
    },

    receipt: {
      titlePaid:     "Your order is being\nprepared, please collect\nyour receipt",
      titlePending:  "Show this receipt\nto the cashier to\ncomplete payment",
      yourOrder:     "Your Order",
      pendingBadge:  "Unpaid — Pay at Cashier",
      orderNo:       "Order No.",
      tableNo:       "Table Number",
      type:          "Type",
      dineIn:        "Dine In",
      takeAway:      "Take Away",
      subTotal:      "Sub-total",
      total:         "Total",
      print:         "Print Receipt",
      done:          "Done",
      restartOrder:  "Start Over",
      accessibility: "Accessibility",
      halalNote:     "All our menus are only made from ingredients that follow halal processing procedures, are high-quality, and eco-friendly.",
    },

    // ── Member Page ───────────────────────────────────────────────────────────
    member: {
      title:              "Do you have a member account?",
      subtitle:           "Enter your phone number to earn points",
      checkButton:        "Check Number",
      checking:           "Checking...",
      memberFound:        "Member found!",
      memberNotFound:     "Number not registered",
      memberNotFoundHint: "Register in the Kopi Jaya app",
      continueButton:     "Continue",
      skip:               "Skip, I don't have a membership",
      restartOrder:       "Start Over",
      accessibility:      "Accessibility",
    },

    languageSelector: {
      indonesia: "Indonesia",
      english:   "English",
    },
  },
} as const;