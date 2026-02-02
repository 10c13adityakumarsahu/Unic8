import { Card, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { captureAndFinalizePaymentService } from "@/services";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PaypalPaymentReturnPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      async function capturePayment() {
        const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

        const response = await captureAndFinalizePaymentService(
          paymentId,
          payerId,
          orderId
        );

        if (response?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/student-courses";
        }
      }

      capturePayment();
    }
  }, [payerId, paymentId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f8fafc]/50">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl p-12 text-center bg-white">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-gray-50 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            </div>
            <div className="absolute inset-0 w-24 h-24 rounded-full border-t-4 border-indigo-600 animate-spin"></div>
          </div>

          <div className="space-y-3">
            <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Processing Payment</CardTitle>
            <p className="text-gray-500 font-medium text-lg leading-relaxed px-4">
              We're finalizing your enrollment. Please do not refresh this page.
            </p>
          </div>

          <div className="pt-8 border-t border-gray-50 w-full flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Secure Encryption Active</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PaypalPaymentReturnPage;
