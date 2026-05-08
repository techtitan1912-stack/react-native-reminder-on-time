export async function safeStopAndUnload(sound) {
  if (!sound) return;
  try {
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
  } catch (e) {
    console.log("safeStopAndUnload error:", e);
  }
}
