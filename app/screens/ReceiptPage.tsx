"use client";

import React, { useRef, useEffect, useState } from "react";
import { RotateCcw, Accessibility, Printer, Download } from "lucide-react";
import { CartItem, MemberInfo, formatRp } from "./types";
import { useLanguage } from "@/context/LanguageContext";
import type { ApiConfig } from "@/lib/api";
import { setPickupCode } from "@/lib/api";

type ReceiptStatus = "paid" | "pending";

// ─── HELPER ──────────────────────────────────────────────────────────────────
function formatDate(date: Date): string {
  const d  = date.getDate().toString().padStart(2, "0");
  const m  = (date.getMonth() + 1).toString().padStart(2, "0");
  const y  = date.getFullYear();
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  return `${d}-${m}-${y} ${hh}:${mm}`;
}

// Hitung amount dari type + value
function calcAmount(subtotal: number, type: string, value: number): number {
  if (type === "percentage") return Math.round(subtotal * (value / 100));
  return value; // nominal
}

// Format persen: 11.00 → "11%", 3.00 → "3%"
function formatPct(value: number): string {
  const v = parseFloat(value.toString());
  return `${v % 1 === 0 ? v.toFixed(0) : v}%`;
}

// Generate kode kasir 5 digit (alfanumerik: huruf besar + angka)
// Karakter yang mudah tertukar (O/0, I/1) sengaja dihilangkan agar mudah dibacakan ke kasir
function generateCashierCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ─── KOMPONEN ISI STRUK ───────────────────────────────────────────────────────
// Dipisah agar bisa dipakai untuk preview & print
function ReceiptContent({
  cart,
  tableNumber,
  orderNumber,
  orderId,
  status,
  member,
  totalPoints,
  kioskConfig,
  paymentMethod,
  cashierCode,
}: {
  cart: CartItem[];
  tableNumber: string | null;
  orderNumber: string;
  orderId: number | null;
  status: ReceiptStatus;
  member: MemberInfo;
  totalPoints: number;
  kioskConfig: ApiConfig | null;
  paymentMethod: string;
  cashierCode: string;
}) {
  const isPaid      = status === "paid";
  const isTakeaway  = !tableNumber;
  const subTotal    = cart.reduce((s, item) => s + item.totalPrice, 0);
  const now         = formatDate(new Date());

  // Tax — selalu tampil jika ada
  const tax         = kioskConfig?.tax ?? null;
  const taxAmount   = tax ? calcAmount(subTotal, tax.type, tax.value) : 0;

  // Service charge — HANYA untuk takeaway
  const sc          = (isTakeaway && kioskConfig?.service_charge) ? kioskConfig.service_charge : null;
  const scAmount    = sc ? calcAmount(subTotal, sc.type, sc.value) : 0;

  const totalFinal  = subTotal + taxAmount + scAmount;

  const SEP = "--------------------------------";

  return (
    <div
      id="receipt-content"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "12px",
        color: "#000",
        lineHeight: "1.4",
        width: "100%",
        maxWidth: "300px",
        margin: "0 auto",
        padding: "12px 10px",
        backgroundColor: "#fff",
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        {/* Logo — ganti src dengan path logo aslimu */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/jaya_text.png"
          alt="Logo"
          style={{ width: "100px", marginBottom: "6px", display: "block", margin: "0 auto 6px" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div style={{ fontWeight: "bold", fontSize: "13px" }}>Toko Kopi Jaya</div>
        <div style={{ fontSize: "10px" }}>Jl. Pajajaran No.25D, Klojen, Malang</div>
        <div style={{ fontSize: "10px" }}>Telp: +62 811-3333-2323</div>
      </div>

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* ── INFO ORDER ─────────────────────────────────────────────────── */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
        <tbody>
          <tr>
            <td style={{ width: "36%", paddingBottom: "1px" }}>Nota</td>
            <td style={{ width: "4%"  }}>:</td>
            <td>#{orderId ?? orderNumber}</td>
          </tr>
          <tr>
            <td style={{ paddingBottom: "1px" }}>Tanggal</td>
            <td>:</td>
            <td>{now}</td>
          </tr>
          <tr>
            <td style={{ paddingBottom: "1px" }}>Kasir</td>
            <td>:</td>
            <td>Kiosk</td>
          </tr>
          {member.type === "member" && (
            <tr>
              <td style={{ paddingBottom: "1px" }}>Pelanggan</td>
              <td>:</td>
              <td>{member.name}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* ── DAFTAR ITEM ────────────────────────────────────────────────── */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
        <tbody>
          {cart.map((item) => {
            const modifierSummary = (item.modifiers ?? []).map((m) => m.name).join(", ");
            const addonSummary    = item.addons.filter((x) => x.qty > 0).map((x) => `${x.qty}x ${x.addon.name}`).join(", ");
            const summary         = [modifierSummary, addonSummary].filter(Boolean).join(", ");
            const unitPrice       = Math.round(item.totalPrice / item.qty);

            return (
              <React.Fragment key={item.cartId}>
                <tr>
                  <td colSpan={3} style={{ fontWeight: "bold", paddingTop: "3px" }}>
                    {item.product.name}
                  </td>
                </tr>
                {summary && (
                  <tr>
                    <td colSpan={3} style={{ fontSize: "10px", paddingBottom: "1px" }}>
                      &nbsp;&nbsp;{summary}
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ width: "14%", paddingBottom: "2px" }}>{item.qty}x</td>
                  <td style={{ width: "46%" }}>
                    Rp {unitPrice.toLocaleString("id-ID")}
                  </td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    Rp {item.totalPrice.toLocaleString("id-ID")}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* ── BREAKDOWN HARGA ────────────────────────────────────────────── */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
        <tbody>
          <tr>
            <td style={{ paddingBottom: "2px" }}>Subtotal</td>
            <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
              Rp {subTotal.toLocaleString("id-ID")}
            </td>
          </tr>

          {scAmount > 0 && sc && (
            <tr>
              <td style={{ paddingBottom: "2px" }}>
                {sc.name}{" "}
                <span style={{ fontSize: "10px" }}>({formatPct(sc.value)})</span>
              </td>
              <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                Rp {scAmount.toLocaleString("id-ID")}
              </td>
            </tr>
          )}

          {taxAmount > 0 && tax && (
            <tr>
              <td style={{ paddingBottom: "2px" }}>
                {tax.name}{" "}
                <span style={{ fontSize: "10px" }}>({formatPct(tax.value)})</span>
              </td>
              <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                Rp {taxAmount.toLocaleString("id-ID")}
              </td>
            </tr>
          )}

          <tr>
            <td colSpan={2} style={{ padding: "2px 0" }}>
              <div style={{ borderTop: "1px solid #000" }} />
            </td>
          </tr>

          <tr>
            <td style={{ fontWeight: "bold", fontSize: "14px", paddingTop: "2px" }}>Total</td>
            <td style={{ fontWeight: "bold", fontSize: "14px", textAlign: "right", whiteSpace: "nowrap", paddingTop: "2px" }}>
              Rp {totalFinal.toLocaleString("id-ID")}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      {/* ── FOOTER STRUK ───────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", fontSize: "11px" }}>
        <div>Pembayaran: {paymentMethod.toUpperCase()}</div>
        {isPaid ? (
          <div style={{ fontWeight: "bold", fontSize: "13px", marginTop: "3px" }}>
            LUNAS
          </div>
        ) : (
          <>
            <div style={{ fontWeight: "bold", fontSize: "12px", marginTop: "3px" }}>
              BELUM LUNAS — Bayar di Kasir
            </div>
            <div style={{ marginTop: "6px", fontSize: "11px" }}>
              Tunjukkan kode ini ke kasir:
            </div>
            <div style={{
              fontWeight: "bold",
              fontSize: "24px",
              letterSpacing: "6px",
              marginTop: "4px",
              border: "2px solid #000",
              display: "inline-block",
              padding: "4px 12px",
            }}>
              {cashierCode}
            </div>
          </>
        )}
      </div>

      {/* Poin member */}
      {member.type === "member" && totalPoints > 0 && (
        <>
          <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
          <div style={{ textAlign: "center", fontSize: "10px" }}>
            <div>Halo, {member.name}!</div>
            <div style={{ fontWeight: "bold" }}>+{totalPoints} poin ditambahkan</div>
            <div>Cek poin di aplikasi Kopi Jaya</div>
          </div>
        </>
      )}

      <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />

      <div style={{ textAlign: "center", fontSize: "11px" }}>
        <div>Terima Kasih</div>
        <div>Atas Kunjungan Anda</div>
      </div>
    </div>
  );
}

// ─── HALAMAN UTAMA ────────────────────────────────────────────────────────────
export default function ReceiptPage({
  cart,
  tableNumber,
  orderNumber,
  orderId,
  status,
  member,
  totalPoints,
  kioskConfig,
  paymentMethod,
  onDone,
  onResetAll,
}: {
  cart: CartItem[];
  tableNumber: string | null;
  orderNumber: string;
  orderId: number | null;
  status: ReceiptStatus;
  member: MemberInfo;
  totalPoints: number;
  kioskConfig: ApiConfig | null;
  paymentMethod: "qris" | "cashier" | null;
  onDone: () => void;
  onResetAll: () => void;
}) {
  const { t } = useLanguage();
  const [cashierCode] = useState(() => generateCashierCode());
  const [isDownloading, setIsDownloading] = useState(false);

  // Simpan pickup_code ke tabel orders begitu orderId & kode sudah tersedia
  useEffect(() => {
    if (!orderId || !cashierCode) return;
    setPickupCode(orderId, cashierCode).catch((err) => {
      console.error("Gagal menyimpan pickup_code:", err);
    });
  }, [orderId, cashierCode]);

  // Terjemahkan paymentMethod ke label yang ditampilkan di struk
  const paymentLabel = paymentMethod === "qris" ? "QRIS"
    : paymentMethod === "cashier" ? "Tunai"
    : "Kiosk";

  // ─── PRINT ───────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const element = document.getElementById("receipt-content");
    if (!element) return;

    const printWindow = window.open("", "_blank", "width=380,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk #${orderId ?? orderNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #fff; }
            @media print {
              @page { margin: 4mm; size: 80mm auto; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ─── DOWNLOAD PDF (ukuran kertas thermal 80mm, tinggi otomatis) ───────────
  const downloadReceiptPdf = async () => {
    const element = document.getElementById("receipt-content");
    if (!element || isDownloading) return;

    setIsDownloading(true);
    try {
      // Import dinamis supaya tidak membengkakkan bundle awal kiosk
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const canvas = await html2canvas(element, {
        scale: 2,           // hasil lebih tajam
        backgroundColor: "#ffffff",
        useCORS: true,      // supaya logo (img) ikut ter-capture meski beda origin
        // Eksplisit pakai ukuran elemen sebenarnya, bukan viewport penuh —
        // tanpa ini html2canvas kadang ikut menangkap tinggi h-screen induknya
        // (karena ReceiptPage dibungkus "absolute inset-0"), jadi PDF jadi
        // ada spasi kosong panjang di bawah konten.
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");

      const widthMm  = 80; // lebar kertas thermal 80mm
      const heightMm = (canvas.height * widthMm) / canvas.width; // tinggi mengikuti konten asli

      const pdf = new jsPDF({
        unit: "mm",
        format: [widthMm, heightMm],
      });

      pdf.addImage(imgData, "PNG", 0, 0, widthMm, heightMm);
      pdf.save(`struk-${orderId ?? orderNumber}.pdf`);
    } catch (err) {
      console.error("Gagal membuat PDF struk:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* CSS khusus print — sembunyikan UI kiosk, hanya tampilkan struk */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #receipt-content, #receipt-content * { visibility: visible !important; }
          #receipt-content {
            position: fixed !important;
            top: 0; left: 0;
            width: 80mm !important;
            margin: 0 !important;
            padding: 4mm !important;
          }
        }
      `}</style>

      <div className="w-screen h-screen bg-gray-50 overflow-hidden flex flex-col font-sans">

        {/* ── KONTEN SCROLL ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-4">

          {/* Judul halaman */}
          <h1 className="text-lg font-black text-gray-900 text-center mb-4 leading-snug">
            {status === "paid" ? t.receipt.titlePaid : t.receipt.titlePending}
          </h1>

          {/* Kode kasir — hanya tampil jika belum lunas */}
          {status === "pending" && (
            <div className="mx-auto mb-4 bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-4 py-4 text-center" style={{ maxWidth: "300px" }}>
              <p className="text-xs font-bold text-yellow-700 mb-1">Tunjukkan kode ini ke kasir</p>
              <p className="text-4xl font-black tracking-widest text-gray-900">{cashierCode}</p>
              <p className="text-[10px] text-gray-400 mt-1">Kasir akan memproses pembayaranmu</p>
            </div>
          )}

          {/* Preview struk */}
          <div
            className="mx-auto border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden"
            style={{ maxWidth: "300px" }}
          >
            <ReceiptContent
              cart={cart}
              tableNumber={tableNumber}
              orderNumber={orderNumber}
              orderId={orderId}
              status={status}
              member={member}
              totalPoints={totalPoints}
              kioskConfig={kioskConfig}
              paymentMethod={paymentLabel}
              cashierCode={cashierCode}
            />
          </div>

        </div>

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <div className="shrink-0 bg-white border-t border-gray-100">
          <div className="px-5 pt-3 pb-2 flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-black text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Printer size={15} /> {t.receipt.print}
            </button>
            <button
              onClick={downloadReceiptPdf}
              disabled={isDownloading}
              className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-black text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={15} /> {isDownloading ? t.receipt.downloadingPdf : t.receipt.downloadPdf}
            </button>
            <button
              onClick={onDone}
              className="flex-2 py-3.5 bg-[#C84C34] rounded-xl text-sm font-black text-white shadow-md active:scale-95 transition-transform"
            >
              {t.receipt.done}
            </button>
          </div>

          <div className="flex items-center justify-between px-5 pb-3 gap-3">
            <button
              onClick={onResetAll}
              className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0"
            >
              <RotateCcw size={11} /> {t.receipt.restartOrder}
            </button>
            <p className="text-[7.5px] text-gray-400 leading-tight text-right flex-1">
              {t.receipt.halalNote}
            </p>
            <button className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0">
              <Accessibility size={11} /> {t.receipt.accessibility}
            </button>
          </div>
        </div>

      </div>
    </>
  );
}