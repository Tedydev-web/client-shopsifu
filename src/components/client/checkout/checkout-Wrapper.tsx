"use client";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic"

const CheckoutWrapper = dynamic(() => import("./checkout-Main").then(mod => mod.CheckoutMain), {
    loading: () => <Skeleton className="w-full h-full" />,
    ssr: false,
});

export default function CheckoutMainWrapper() {
    return <CheckoutWrapper />;
}