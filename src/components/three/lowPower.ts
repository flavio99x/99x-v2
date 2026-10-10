type NavigatorWithConnection = Navigator & { connection?: { saveData?: unknown } };

/** Low-power device that asked to save data: keep the static logo instead of loading 3D. */
export function isLowPowerDevice(nav: Navigator | undefined = typeof navigator === "undefined" ? undefined : navigator): boolean {
  if (!nav) return false;
  const cores = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : Infinity;
  const saveData = (nav as NavigatorWithConnection).connection?.saveData === true;
  return cores <= 4 && saveData;
}
