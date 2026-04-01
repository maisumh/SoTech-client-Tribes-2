"use client";

import Script from "next/script";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { FINAL_CTA } from "@/lib/constants";

export default function FinalCTA() {
  return (
    <section id="final-cta" className="py-16 md:py-24 bg-firefly text-white">
      <div className="max-w-[600px] mx-auto px-4 text-center">
        <ScrollReveal>
          <div className="ghl-form-wrapper">
            <iframe
              src="https://link.thesocialtech.net/widget/form/p1UulgwUiKagQ46PUkkl"
              style={{ width: "100%", height: "716px", border: "none", borderRadius: "3px" }}
              scrolling="no"
              id="inline-p1UulgwUiKagQ46PUkkl"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Landing Page"
              data-height="716"
              data-layout-iframe-id="inline-p1UulgwUiKagQ46PUkkl"
              data-form-id="p1UulgwUiKagQ46PUkkl"
              title="Landing Page"
            />
          </div>
          <Script
            src="https://link.thesocialtech.net/js/form_embed.js"
            strategy="afterInteractive"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-lg mt-8">
            {FINAL_CTA.prefix}{" "}
            <span className="font-bold text-casablanca">
              {FINAL_CTA.number}
            </span>{" "}
            {FINAL_CTA.suffix}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
