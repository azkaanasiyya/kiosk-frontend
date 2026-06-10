import Image from "next/image";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

export default function ServiceTypePage({
  onDineIn,
  onTakeAway,
}: {
  onDineIn: () => void;
  onTakeAway: () => void;
}) {
    const { t } = useLanguage();
  return (
    <div className="w-screen h-screen bg-white overflow-hidden">
      <main className="relative w-full h-full bg-white flex flex-col font-sans">

        <div className="flex-1 flex flex-col items-center justify-center gap-12 py-12 px-6">

          {/* Header */}
          <div className="content-top w-full">
            <p className="text-3xl leading-[120%] font-bold text-grayscale-900 text-center tracking-tight">
              {t.serviceType.title}
            </p>
          </div>

          {/* Pilihan */}
          <div className="button-wrapper flex flex-row w-full gap-4">
            <button
              onClick={onDineIn}
              className="flex flex-col w-full py-8 items-center justify-start px-8 gap-6 cursor-pointer rounded-[16px] border border-grayscale-400 bg-linear-to-b from-white to-grayscale-200 shadow-sm active:scale-95 transition-transform"
            >
              <Image
                src="/shop-cashier.svg"
                alt="shop-cashier"
                className="object-contain"
                width={64}
                height={64}
              />
              <span className="text-xl text-grayscale-900 font-bold">{t.serviceType.dineIn}</span>
            </button>

            <button
              onClick={onTakeAway}
              className="flex flex-col w-full py-8 items-center justify-start px-8 gap-6 cursor-pointer rounded-[16px] border border-grayscale-400 bg-linear-to-b from-white to-grayscale-200 shadow-sm active:scale-95 transition-transform"
            >
              <Image
                src="/bag-side.svg"
                alt="bag-side"
                className="object-contain"
                width={64}
                height={64}
              />
              <span className="text-xl text-grayscale-900 font-bold">{t.serviceType.takeAway}</span>
            </button>
          </div>

          {/* Pemilih Bahasa */}
          <div className="content-bottom w-full flex flex-col gap-8 items-center">
            <div className="w-full border-t-2 border-dashed border-gray-200" />
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex flex-row gap-2 items-center opacity-60">
                <Image src="/translate.svg" alt="translate" width={20} height={20} />
                <span className="text-sm font-bold text-grayscale-900 uppercase tracking-widest">{t.serviceType.language}</span>
              </div>
              <LanguageSelector />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}