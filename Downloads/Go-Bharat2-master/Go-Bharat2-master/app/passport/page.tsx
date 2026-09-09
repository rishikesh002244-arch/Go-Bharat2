import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DigitalPassport from "@/components/sih-features/DigitalPassport";

export default function PassportPage() {
  return <div className="flex min-h-screen flex-col bg-[#fafafa] text-[#14213d]"><Navbar /><DigitalPassport /><Footer /></div>;
}
