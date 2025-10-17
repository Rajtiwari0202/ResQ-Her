import { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    // This setting explicitly tells Next.js where your source code is.
    // This is vital for correctly resolving absolute paths like "@/components/..."
    // and helps the compiler correctly locate files like your CSS imports.
    sassOptions: {
        includePaths: [path.join(__dirname, 'src')],
    },

    // Any other configuration options would go here.
};

export default nextConfig;