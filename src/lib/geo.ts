export function project(lat: number, lng: number, width: number, height: number) {
  return { x: ((lng + 180) / 360) * width, y: ((90 - lat) / 180) * height };
}
