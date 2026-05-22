/** Lazy-load LiveKit so the app shell renders even if WebRTC init is slow or fails. */
export async function loadLiveKit() {
  return import("livekit-client");
}
