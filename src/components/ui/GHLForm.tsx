"use client";

import Script from "next/script";

export default function GHLForm() {
  return (
    <>
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
      <Script
        src="https://link.thesocialtech.net/js/form_embed.js"
        strategy="afterInteractive"
      />
    </>
  );
}
