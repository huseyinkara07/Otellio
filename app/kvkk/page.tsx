import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { kvkkPage } from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — Otellio",
  description:
    "Otellio'nun kişisel verileri hangi amaçlarla ve nasıl işlediğine dair KVKK aydınlatma metni.",
};

export default function KvkkPage() {
  return <LegalPage content={kvkkPage} />;
}
