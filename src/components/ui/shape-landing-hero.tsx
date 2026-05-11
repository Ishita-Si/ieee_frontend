"use client";

import { motion } from "framer-motion";

function HeroGeometric({
    imageSrc = "/ieee logo.png",
    imageAlt = "IEEE RGIPT Student Branch",
}: {
    imageSrc?: string;
    imageAlt?: string;
}) {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
            <motion.img
                src={imageSrc}
                alt={imageAlt}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative z-10 w-[min(78vw,720px)] h-auto object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
            />
        </div>
    );
}

export { HeroGeometric }
