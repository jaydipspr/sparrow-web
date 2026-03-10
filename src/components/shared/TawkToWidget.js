"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TawkToWidget() {
    const pathname = usePathname();

    // Don't load chat widget inside admin area
    if (pathname?.startsWith("/admin")) return null;

    // Tawk.to configuration - using your provided IDs
    const propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
    const widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID;

    // Standard Tawk.to embed URL format: https://embed.tawk.to/{propertyId}/{widgetId}
    const embedSrc = `https://embed.tawk.to/${propertyId}/${widgetId}`;

    // Configure Tawk.to to show on left side
    useEffect(() => {
        if (typeof window !== "undefined" && window.Tawk_API) {
            // Set widget position to left
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_API.customStyle = {
                visibility: {
                    desktop: {
                        position: "bl", // bottom-left
                        xOffset: 20,
                        yOffset: 20,
                    },
                    mobile: {
                        position: "bl", // bottom-left
                        xOffset: 20,
                        yOffset: 20,
                    },
                },
            };
        }
    }, []);

    return (
        <Script
            id="tawkto-widget"
            strategy="afterInteractive"
            onLoad={() => {
                // Configure widget position after script loads
                if (typeof window !== "undefined" && window.Tawk_API) {
                    window.Tawk_API.customStyle = {
                        visibility: {
                            desktop: {
                                position: "bl", // bottom-left
                                xOffset: 20,
                                yOffset: 20,
                            },
                            mobile: {
                                position: "bl", // bottom-left
                                xOffset: 20,
                                yOffset: 20,
                            },
                        },
                    };
                }
            }}
            dangerouslySetInnerHTML={{
                __html: `
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
Tawk_API.customStyle = {
	visibility: {
		desktop: {
			position: 'bl',
			xOffset: 20,
			yOffset: 20
		},
		mobile: {
			position: 'bl',
			xOffset: 20,
			yOffset: 20
		}
	}
};
(function(){
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='${embedSrc}';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
})();`,
            }}
        />
    );
}

