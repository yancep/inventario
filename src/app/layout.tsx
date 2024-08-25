"use client";
import type { Metadata } from "next";

import "./globals.css";
import  Sidebar  from '@/components/Sidebar';
import {Toaster} from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
          <title>Inventario</title>
        </head>
        <body >
        <Toaster position={'bottom-right'}/>
          <Sidebar>
            {children}
          </Sidebar> 
        </body> 
    </html>
  );
}
