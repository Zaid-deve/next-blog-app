import Image from "next/image";
import { Menu } from "./Menu";

export default function Navbar() {
    return (
        <div className="w-full py-2 px-12">
            <div className="flex items-center max-w-7xl mx-auto">
                <div className="branding">
                    <Image src={"/pngtree-colorful-blog-speech-bubble-vector-png-image_6633021.png"} alt="Logo" height={120} width={120} />
                </div>

                <div className="ms-auto">
                    <Menu/>
                </div>
            </div>
        </div>
    )
}