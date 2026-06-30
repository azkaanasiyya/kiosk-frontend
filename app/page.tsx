"use client";

import React from "react";
import { useAppFlow } from "./useAppFlow";

import StartPage            from "../components/StartPage";
import ServiceTypePage      from "../components/ServiceTypePage";
import MemberPage           from "./screens/MemberPage";
import MenuPage             from "./screens/MenuPage";
import ProductDetailPage    from "./screens/ProductDetailPage";
import SuccessScreen        from "./screens/SuccessScreen";
import RecommendationPage   from "./screens/RecommendationPage";
import CartPage             from "./screens/CartPage";
import PaymentMethodPage    from "./screens/PaymentMethodPage";
import PickTableNumberPage  from "./screens/PickTableNumberPage";
import InputTableNumberPage from "./screens/InputTableNumberPage";
import QRISPage             from "./screens/QrisPage";
import ReceiptPage          from "./screens/ReceiptPage";

export default function Page() {
  const flow = useAppFlow();

  // ── Overlay loading & error submit order ─────────────────────────────────
  const submittingOverlay = flow.isSubmitting && (
    <div className="fixed inset-0 z-50 bg-white/80 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-[#C84C34] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-black text-gray-700 animate-pulse">Memproses pesanan...</p>
    </div>
  );

  const errorOverlay = flow.orderError && !flow.isSubmitting && (
    <div className="fixed inset-0 z-50 bg-white/90 flex flex-col items-center justify-center gap-4 px-8">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-2xl">✗</span>
      </div>
      <p className="text-base font-black text-gray-900 text-center">Gagal membuat pesanan</p>
      <p className="text-sm text-gray-500 text-center">{flow.orderError}</p>
      <button
        onClick={() => flow.goBackToCart()}
        className="px-8 py-3 bg-[#C84C34] text-white rounded-xl text-sm font-black"
      >
        Kembali ke Keranjang
      </button>
    </div>
  );

  // ── MenuPage SELALU di-render, hanya disembunyikan saat screen lain aktif ──
  // PENTING: ini mencegah unmount/remount agar activeCatId tidak reset
  const menuScreens = ["menu", "detail", "success"];
  const showMenu = menuScreens.includes(flow.screen);

  const menuPage = (
    <div className={showMenu ? "block" : "hidden"}>
      <MenuPage
        cart={flow.cart}
        onSelectProduct={(p) => flow.goToDetail(p, "menu")}
        onViewCart={flow.goToRecommendation}
        onResetAll={flow.resetAll}
        savedCatId={flow.savedCatId}
        onCatChange={flow.setSavedCatId}
        categories={flow.menuCategories}
        products={flow.menuProducts}
        favorites={flow.favorites}
        loading={flow.menuLoading}
        error={flow.menuError}
      />
    </div>
  );

  // ── Screen tanpa MenuPage di background ───────────────────────────────────
  if (flow.screen === "start") {
    return <StartPage onStart={flow.goToServiceType} />;
  }

  if (flow.screen === "service-type") {
    return (
      <ServiceTypePage
        onDineIn={() => flow.chooseServiceType("dine-in")}
        onTakeAway={() => flow.chooseServiceType("take-away")}
      />
    );
  }

  if (flow.screen === "member") {
    return (
      <MemberPage
        onContinue={flow.setMemberAndContinue}
        onSkip={() => flow.setMemberAndContinue({ type: "guest" })}
        onResetAll={flow.resetAll}
      />
    );
  }

  // ── Screen-screen yang dirender BERSAMA MenuPage (sebagai overlay) ────────
  return (
    <div className="relative w-screen h-screen overflow-hidden">

      {/* MenuPage selalu ada di background, tidak pernah unmount */}
      {menuPage}

      {/* Detail produk */}
      {flow.screen === "detail" && flow.selectedProduct && (
        <div className="absolute inset-0 z-10">
          <ProductDetailPage
            product={flow.selectedProduct}
            onBack={flow.goBackFromDetail}
            onAddToCart={flow.addToCart}
          />
        </div>
      )}

      {/* Success screen (auto-dismiss 1.5s → kembali ke menu) */}
      {flow.screen === "success" && (
        <div className="absolute inset-0 z-20">
          <SuccessScreen
            totalPrice={flow.successTotal}
            onDone={flow.onSuccessDone}
          />
        </div>
      )}

      {/* Recommendation */}
      {flow.screen === "recommendation" && (
        <div className="absolute inset-0 z-30">
          <RecommendationPage
            favorites={flow.favorites}
            onSelectProduct={(p) => flow.goToDetail(p, "recommendation")}
            onSkip={flow.goToCart}
          />
        </div>
      )}

      {/* Cart */}
      {flow.screen === "cart" && (
        <div className="absolute inset-0 z-30">
          <CartPage
            cart={flow.cart}
            onUpdateQty={flow.updateCartQty}
            onRemove={flow.removeFromCart}
            onAddMore={flow.goBackToMenu}
            onCheckout={flow.goToPayment}
            onResetAll={flow.resetAll}
          />
        </div>
      )}

      {/* Payment */}
      {flow.screen === "payment" && (
        <div className="absolute inset-0 z-30">
          {submittingOverlay}
          {errorOverlay}
          <PaymentMethodPage
            onPayHere={() => flow.choosePaymentMethod("qris")}
            onPayAtCashier={() => flow.choosePaymentMethod("cashier")}
            onBack={flow.goBackToCart}
            onResetAll={flow.resetAll}
          />
        </div>
      )}

      {/* Pick table */}
      {flow.screen === "pick-table" && (
        <div className="absolute inset-0 z-30">
          {submittingOverlay}
          {errorOverlay}
          <PickTableNumberPage
            onContinue={flow.goToInputTable}
            onResetAll={flow.resetAll}
          />
        </div>
      )}

      {/* Input table */}
      {flow.screen === "input-table" && (
        <div className="absolute inset-0 z-30">
          {submittingOverlay}
          {errorOverlay}
          <InputTableNumberPage
            onConfirm={flow.confirmTableNumber}
          />
        </div>
      )}

      {/* QRIS */}
      {flow.screen === "qris" && (
        <div className="absolute inset-0 z-30">
          <QRISPage
            cart={flow.cart}
            tableNumber={flow.tableNumber}
            orderNumber={flow.orderNumber}
            orderId={flow.orderId}
            onPaymentSuccess={flow.onQRISPaid}
            onResetAll={flow.resetAll}
          />
        </div>
      )}

      {/* Receipt */}
      {(flow.screen === "receipt-paid" || flow.screen === "receipt-pending") && (
        <div className="absolute inset-0 z-30">
          <ReceiptPage
            cart={flow.cart}
            tableNumber={flow.tableNumber}
            orderNumber={flow.orderNumber}
            orderId={flow.orderId}
            status={flow.screen === "receipt-paid" ? "paid" : "pending"}
            member={flow.member}
            totalPoints={flow.totalPoints}
            kioskConfig={flow.kioskConfig}
            paymentMethod={flow.paymentMethod}
            onDone={flow.resetAll}
            onResetAll={flow.resetAll}
          />
        </div>
      )}

    </div>
  );
}