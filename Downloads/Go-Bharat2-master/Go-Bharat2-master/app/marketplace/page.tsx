import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketplaceExplorer from "@/components/sih-features/MarketplaceExplorer";

export default function MarketplacePage() {
  return <div className="flex min-h-screen flex-col bg-[#fafafa] text-[#14213d]"><Navbar /><MarketplaceExplorer /><Footer /></div>;
}
