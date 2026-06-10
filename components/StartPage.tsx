import Image from "next/image";
import { Accessibility } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function StartPage({ onStart }: { onStart: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="w-screen h-screen bg-white overflow-hidden">
      <main className="relative w-full h-full bg-white flex flex-col font-sans">

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center gap-8 pb-10">

          {/* Gambar Atas */}
          <div className="start-img relative w-full shrink-0">
            <Image
              src="/coffee-start.png"
              alt="coffee"
              sizes="100vw"
              width={500}
              height={300}
              className="w-full h-auto"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent opacity-60" />
          </div>

          {/* Konten Bawah */}
          <div className="px-6 w-full flex flex-row-reverse gap-6">

            {/* Tombol Mulai */}
            <button
              onClick={onStart}
              className="flex flex-col w-full py-10 items-center justify-center gap-3 cursor-pointer rounded-[16px] border border-primary-600 bg-linear-to-b from-primary-400 to-primary-900 shadow-lg active:scale-95 transition-transform"
            >
              <Image
                src="/handpointing.svg"
                alt="handpointing"
                className="object-contain"
                width={36}
                height={36}
              />
              <div className="flex flex-col gap-1 items-center justify-center">
                <span className="text-lg text-white font-bold">{t.start.startOrder}</span>
                <span className="text-[10px] font-medium text-white/80">{t.start.tapToOrder}</span>
              </div>
            </button>

            {/* Tombol Sekunder */}
            <div className="flex flex-col gap-2">
              <button className="flex flex-col w-full h-full py-4 px-6 items-center justify-between cursor-pointer rounded-[12px] border border-gray-200 bg-white shadow-sm active:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Image src="/qrcode.svg" alt="qrcode" width={16} height={16} />
                  <span className="text-sm font-bold text-gray-800">{t.start.scanGift}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">{t.start.storeName}</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 rounded-[12px] border border-gray-200 bg-white text-sm font-bold text-gray-700">
                  <Image src="/translate.svg" alt="lang" width={14} height={14} />
                  {t.start.language}
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-[12px] border border-gray-200 bg-white text-sm font-bold text-gray-700">
                  <Accessibility size={14} />
                  {t.start.accessibility}
                </button>
              </div>

              <p className="text-[10px] text-gray-400 leading-relaxed">
                {t.start.halalNote}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}