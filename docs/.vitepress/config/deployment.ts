/** Build-time configuration, deliberately unset until the owner supplies it. */
const rawUrl = process.env.SITE_URL?.trim();
export const siteUrl = rawUrl ? new URL(rawUrl).href.replace(/\/$/, '') : '';
export const gaMeasurementId = process.env.GA_MEASUREMENT_ID?.trim() || '';

if (siteUrl && !/^https?:\/\//.test(siteUrl)) {
  throw new Error('SITE_URL must be a full http(s) website URL.');
}
if (gaMeasurementId && !/^G-[A-Z0-9]+$/.test(gaMeasurementId)) {
  throw new Error('GA_MEASUREMENT_ID must be a GA4 ID starting with G-.');
}
