import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src="/logo_ecommerzx.png" alt="EcommerzX Logo" width={40} height={42} {...props} />;
}
