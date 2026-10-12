// Exploded 2D logo built from the same SVG paths — used for reduced motion / no WebGL / before the 3D chunk loads.
// Piece order and colours mirror PIECE_GROUPS / PIECE_COLORS in logoGeometry.ts.
// Each piece keeps every source path's original fill (the 9 tails stay bronze / brown).
const PIECES: { dx: number; dy: number; paths: { d: string; fill: string }[] }[] = [
  { dx: -10, dy: 2, paths: [
    { fill: "#A2B372", d: "M10.551 22.0507C16.2876 22.0507 21.0509 17.0197 21.0509 10.9718C21.0509 4.92394 16.2876 0 10.551 0C4.71212 0 0 4.92394 0 10.9718C0 17.0732 4.71212 22.0507 10.551 22.0507ZM2.40728 10.9183C2.40728 15.6817 6.09502 19.6423 10.551 19.6423C15.0071 19.6423 18.6437 15.6817 18.6437 10.9183C18.6437 6.26197 14.9559 2.40845 10.551 2.40845C5.99259 2.40845 2.40728 6.15493 2.40728 10.9183Z" },
    { fill: "#BC8E58", d: "M9.6796 37.9999L19.5648 23.8703L17.5673 22.2646L7.63086 36.2872L9.6796 37.9999Z" },
  ] },
  { dx: -2, dy: -8, paths: [
    { fill: "#C49FD5", d: "M36.7093 22.0507C42.4458 22.0507 47.2091 17.0197 47.2091 10.9718C47.2091 4.92394 42.4458 0 36.7093 0C30.8703 0 26.1582 4.92394 26.1582 10.9718C26.1582 17.0732 30.8703 22.0507 36.7093 22.0507ZM28.5655 10.9183C28.5655 15.6817 32.2532 19.6423 36.7093 19.6423C41.1653 19.6423 44.8019 15.6817 44.8019 10.9183C44.8019 6.26197 41.1141 2.40845 36.7093 2.40845C32.1508 2.40845 28.5655 6.15493 28.5655 10.9183Z" },
    { fill: "#905B54", d: "M35.8378 37.9999L45.723 23.8703L43.7255 22.2646L33.7891 36.2872L35.8378 37.9999Z" },
  ] },
  { dx: 8, dy: 3, paths: [{ fill: "#CCB189", d: "M71.4494 37.9998L73.242 36.5012L54.1886 11.2393L52.3447 12.7378L71.4494 37.9998Z" }] },
  { dx: 10, dy: -8, paths: [{ fill: "#B44B4B", d: "M72.5263 12.7378L65.3557 22.3181L63.6143 20.659L70.6824 11.2393L72.5263 12.7378Z" }] },
  { dx: 4, dy: 9, paths: [{ fill: "#7A6977", d: "M53.4216 38.0003L61.3604 27.5636L59.5678 25.958L51.6289 36.5017L53.4216 38.0003Z" }] },
];

export function StaticLogoFallback({ active = -1 }: { active?: number }) {
  return (
    <svg viewBox="-16 -14 106 66" className="h-full w-full" aria-hidden="true">
      {PIECES.map((p, i) => (
        <g
          key={i}
          data-piece={i}
          transform={`translate(${p.dx} ${p.dy})`}
          opacity={active === -1 || active === i ? 1 : 0.35}
          style={{ transition: "opacity .6s" }}
        >
          {p.paths.map((path) => (
            <path key={path.d} d={path.d} fill={path.fill} fillRule="evenodd" />
          ))}
        </g>
      ))}
    </svg>
  );
}
