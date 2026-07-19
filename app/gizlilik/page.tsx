import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { privacyPage } from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Otellio",
  description:
    "Otellio'nun hangi verileri topladığı, nasıl koruduğu ve hangi hizmet sağlayıcılarla çalıştığına dair gizlilik politikası.",
};

export default function GizlilikPage() {
  return <LegalPage content={privacyPage} />;
}
