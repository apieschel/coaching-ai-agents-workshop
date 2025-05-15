import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { CopilotKit } from "@copilotkit/react-core"; 
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CopilotKit Todos",
  description: "A simple todo app using CopilotKit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Suspense>{children}</Suspense> */}
        {/* Make sure to use the URL you configured in the previous step  */}
        <CopilotKit runtimeUrl="/api/copilotkit"> 
          <Suspense>{children}</Suspense>
        </CopilotKit>
      </body>
    </html>
  );
}
