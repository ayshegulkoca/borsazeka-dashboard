/**
 * Appends the user's email to a Stripe Checkout URL for prefilling.
 * Handles both new and existing query parameters.
 * 
 * @param url The base Stripe Checkout URL
 * @param email The user's email address
 * @returns The updated URL with ?locked_prefilled_email=...
 */
export function getPrefilledStripeLink(url: string, email: string): string {
  if (!url) return url;
  if (!email) return url;

  const separator = url.includes("?") ? "&" : "?";
  const param = `locked_prefilled_email=${encodeURIComponent(email)}`;
  
  return `${url}${separator}${param}`;
}
