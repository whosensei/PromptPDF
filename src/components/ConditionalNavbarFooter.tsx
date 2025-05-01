"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ConditionalNavbarFooterProps {
  children: React.ReactNode;
}

export default function ConditionalNavbarFooter({ children }: ConditionalNavbarFooterProps) {
  const pathname = usePathname();
  const showLayout = pathname === "/" || pathname.startsWith("/upload");
  return (
    <>
      {showLayout && <Navbar />}
      {children}
      {showLayout && <Footer />}
    </>
  );
} 