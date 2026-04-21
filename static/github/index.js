const ALLOWED_DOMAINS = ["neelamb.com.np", "neelamb.com"];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const referer = request.headers.get("Referer");
    const origin = request.headers.get("Origin");

    // ?view=true ले सिधा हेर्न सकिन्छ
    if (url.searchParams.get("view") === "true") {
      return env.ASSETS.fetch(request);
    }

    // Referer वा Origin जाँच
    const requestOrigin = origin || (referer ? new URL(referer).origin : null);

    if (requestOrigin) {
      const requestHost = new URL(requestOrigin).hostname;
      
      // ✅ endsWith ले exact domain + subdomain मात्र मिलाउँछ
      const isAllowed = ALLOWED_DOMAINS.some(d => 
        requestHost === d || requestHost.endsWith("." + d)
      );

      if (isAllowed) {
        const response = await env.ASSETS.fetch(request);
        const newHeaders = new Headers(response.headers);
        newHeaders.set("Access-Control-Allow-Origin", requestOrigin);
        newHeaders.set("X-Content-Type-Options", "nosniff");
        return new Response(response.body, {
          status: response.status,
          headers: newHeaders,
        });
      }
    }

    // अन्य सबै request अस्वीकार
    return new Response("Unauthorized Access: This CDN is private.", {
      status: 403,
      headers: { "Content-Type": "text/plain" },
    });
  },
};
