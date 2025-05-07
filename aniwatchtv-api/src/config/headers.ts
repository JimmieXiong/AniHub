
type HeaderConfig = {
  "USER_AGENT_HEADER": string,          // Pretends to be a browser (Firefox on Linux) so the website doesn't block the request. FIREFOX!!
  "ACCEPT_ENCODEING_HEADER": string,    // Tells the server we can handle compressed content (gzip, br), which many websites use to reduce bandwidth.
  "ACCEPT_HEADER": string               // Says we accept HTML/XML/images, which helps the server return the right content instead of an error or redirect.
}


const headers: HeaderConfig = {
  USER_AGENT_HEADER: "Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0",
  ACCEPT_ENCODEING_HEADER: "gzip, deflate, br",
  ACCEPT_HEADER: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
}

export { headers, HeaderConfig };
