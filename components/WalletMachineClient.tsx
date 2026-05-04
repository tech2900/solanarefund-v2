"use client";
import dynamic from "next/dynamic";

const WalletMachine = dynamic(() => import("@/components/WalletMachine").then(m => ({ default: m.WalletMachine })), { ssr: false });

export function WalletMachineClient() {
  return <WalletMachine />;
}
