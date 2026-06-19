/** Requests Cloudinary upload credentials for a turn's recorded audio, then
 * uploads the blob directly to Cloudinary (never through our own backend).
 * Returns the `storage_key` to send over the session WebSocket, or null if
 * any step fails — callers should treat that as "no audio for this turn",
 * not an error. */
export async function uploadTurnAudio(
  sessionId: string,
  turnSequence: number,
  blob: Blob,
  mimeType: string,
): Promise<string | null> {
  try {
    const credRes = await fetch(`/api/v1/sessions/${sessionId}/turns/audio-upload-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ turn_sequence: turnSequence, content_type: mimeType }),
    });
    const credData = await credRes.json();
    if (!credRes.ok || !credData.success) return null;

    const { upload_url, storage_key, upload_params } = credData.data as {
      upload_url: string;
      storage_key: string;
      upload_params: Record<string, string>;
    };

    const form = new FormData();
    form.append("file", blob);
    Object.entries(upload_params).forEach(([key, value]) => form.append(key, value));

    const uploadRes = await fetch(upload_url, { method: "POST", body: form });
    if (!uploadRes.ok) return null;

    return storage_key;
  } catch {
    return null;
  }
}
