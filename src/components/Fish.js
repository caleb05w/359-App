//svg drawing tool imports lol
import {
  Svg,
  G,
  Ellipse,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

//schema argument which takes an object (fed from the chat.js file)
export default function Fish({ schema }) {
  //destructuring the schema
  //default options if the schema is blank
  const {
    size = 220,
    bodyColor = "#FF9566",
    finColor = "#FFB07A",
    eyeColor = "#1A1A1A",
    pattern = "stripes",
    tail = "fan",
    dorsal = "small",
    flip = false,
  } = schema || {};

  return (
    <Svg width={size} height={(size * 140) / 220} viewBox="0 0 220 140">
      <Defs>
        <LinearGradient id="shade" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopOpacity="0.12" stopColor="#000" />
          <Stop offset="100%" stopOpacity="0" stopColor="#000" />
        </LinearGradient>
      </Defs>

      <G transform={flip ? "translate(220,0) scale(-1,1)" : undefined}>
        {/* Tail */}
        {tail === "triangle" ? (
          <Path d="M180 70 L220 50 L220 90 Z" fill={finColor} opacity={0.95} />
        ) : (
          <Path
            d="M182 70 C210 40, 210 40, 220 52 C216 70, 216 70, 220 88 C210 100, 210 100, 182 70 Z"
            fill={finColor}
            opacity={0.95}
          />
        )}

        {/* Body */}
        <Ellipse cx="110" cy="70" rx="85" ry="52" fill={bodyColor} />
        <Ellipse cx="110" cy="70" rx="85" ry="52" fill="url(#shade)" />

        {/* Pectoral fin */}
        <Path
          d="M95 92 C85 100, 75 104, 70 108 C80 102, 88 98, 95 92 Z"
          fill={finColor}
          opacity={0.9}
        />

        {/* Dorsal fin */}
        {dorsal !== "none" && (
          <Path
            d={
              dorsal === "big"
                ? "M90 25 C110 5, 140 5, 150 26 C135 22, 120 24, 90 25 Z"
                : "M98 30 C112 18, 130 18, 142 30 C128 28, 114 29, 98 30 Z"
            }
            fill={finColor}
            opacity={0.9}
          />
        )}

        {/* Eye */}
        <Circle cx="55" cy="58" r="10" fill="#fff" />
        <Circle cx="58" cy="60" r="5.2" fill={eyeColor} />

        {/* Gill line */}
        <Path
          d="M78 52 C78 70, 78 70, 78 86"
          stroke="#000"
          strokeOpacity="0.18"
          strokeWidth="3"
        />

        {/* Pattern */}
        {pattern === "stripes" &&
          [0, 1, 2, 3].map((i) => {
            const x = 105 + i * 16;
            return (
              <Path
                key={i}
                d={`M${x} 30 C ${x - 10} 50, ${x - 10} 90, ${x} 110`}
                stroke="#ffffff"
                strokeOpacity="0.22"
                strokeWidth="6"
              />
            );
          })}

        {pattern === "spots" &&
          [
            [100, 45],
            [125, 60],
            [108, 78],
            [140, 75],
            [130, 95],
          ].map(([x, y], idx) => (
            <Circle
              key={idx}
              cx={x}
              cy={y}
              r="6.5"
              fill="#ffffff"
              opacity={0.22}
            />
          ))}
      </G>
    </Svg>
  );
}
