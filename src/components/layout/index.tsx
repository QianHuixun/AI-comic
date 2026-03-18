import type React from "react";
import { Footer } from "../footer";
import { Header } from "../header";

export function Layout({children}:{children:React.ReactNode}) {
  return (
    <>
      <section>
        <Header />
        <div className="pt-[6%]">
        { children}
        </div>
        <Footer />
      </section>
    </>
  );
}
