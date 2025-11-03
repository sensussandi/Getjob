"use client";

import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection"; // import HeroSection

export default function Home() {
  return (
    <div className="min-h-[100vh] bg-white">
      {/* Hero Section di bagian atas */}
      <HeroSection />
    </div>
  );
}
