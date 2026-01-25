import type { ImgHTMLAttributes } from "react";

type AppLogoIconProps = ImgHTMLAttributes<HTMLImageElement>;

export default function AppLogoIcon(props: AppLogoIconProps) {
    return (
        <img
            src="/images/logo.png"
            alt="Premsons Motor Group"
            {...props}
            className={`h-8 w-auto object-contain ${props.className ?? ""}`}
        />
    );
}
