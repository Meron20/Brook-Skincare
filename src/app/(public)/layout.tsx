import Footer from "@/components/public/Footer";
import { SettingsProvider } from "@/components/public/SettingsProvider";
import Navbar from "@/components/shared/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
     <SettingsProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
    </SettingsProvider>
    </>
  );
}