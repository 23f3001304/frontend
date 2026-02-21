/**
 * @module lib/download
 * Utility helpers for triggering file downloads from Blobs.
 */

/**
 * Triggers a browser download for the given Blob.
 * Creates a temporary anchor element, clicks it, and cleans up.
 *
 * @param blob     The Blob or File to download.
 * @param filename The suggested filename for the download.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Triggers a browser "open in new tab" for a Blob (e.g. PDF preview).
 *
 * @param blob The Blob to open.
 */
export function openBlob(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  // Note: revoking immediately may close the tab before load.
  // In production, consider cleanup on window unload.
}
