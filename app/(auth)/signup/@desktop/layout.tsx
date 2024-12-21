import React, { ReactNode } from 'react';

interface LoginDesktopLayoutProps{
    children : ReactNode
}

export default function LoginMobileLayout({children}:LoginDesktopLayoutProps){
    
    return(
        <>
        {children}
        </>
    )
}