import React, { useId } from "react";
import { Image } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  G,
  Path,
  Circle,
  Use,
} from "react-native-svg";
import { getColorHex } from "./colorMatching";
export default function Garment({ item }) {
  const uid = useId().replace(/:/g, "");
  const color = getColorHex(item) || "#c6b89e";
  if (item.image)
    return (
      <Image
        source={{ uri: item.image }}
        accessibilityLabel={item.name}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
    );
  const isShirt = ["shirt", "jacket", "coat"].includes(item.type);
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 240 250"
      accessibilityLabel={item.name}
    >
      <Defs>
        <LinearGradient id={`${uid}fabric`} x1="0" y1="0" x2="1" y2="0.5">
          <Stop stopColor={color} />
          <Stop offset="0.35" stopColor={color} />
          <Stop offset="0.72" stopColor={color} />
          <Stop offset="1" stopColor={color} />
        </LinearGradient>
        <LinearGradient id={`${uid}shade`}>
          <Stop stopColor="#000" stopOpacity="0.13" />
          <Stop offset="0.3" stopColor="#fff" stopOpacity="0.05" />
          <Stop offset="0.6" stopColor="#000" stopOpacity="0.03" />
          <Stop offset="0.9" stopColor="#fff" stopOpacity="0.13" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </LinearGradient>
      </Defs>
      <G
        fill={`url(#${uid}fabric)`}
        stroke="#000"
        strokeOpacity="0.12"
        strokeWidth="1"
      >
        {isShirt || ["tshirt", "sweater"].includes(item.type) ? (
          <>
            <Path
              id={`${uid}shape`}
              d={
                item.type === "tshirt"
                  ? "M87 35 64 43 26 78 50 107 72 92 70 208Q119 218 170 208L168 92 190 107 214 78 176 43 151 35Z"
                  : "M88 30 63 42 46 58 20 180 46 189 72 105 69 216Q121 225 172 215L167 105 194 189 219 180 193 59 176 43 151 30Z"
              }
            />
            <Use href={`#${uid}shape`} fill={`url(#${uid}shade)`} />
            {isShirt ? (
              <>
                <Path
                  d="m89 30 30 20 32-20-11-9h-39Z"
                  fill="#000"
                  fillOpacity="0.12"
                />
                <Path d="m89 30 30 20-16 24-22-30 8-14Zm62 0-32 20 17 24 23-30-8-14Z" />
                <Path d="M118 51v165m5-148v146" fill="none" />
                {[85, 110, 135, 160, 186, 207].map((y) => (
                  <Circle
                    key={y}
                    cx="120"
                    cy={y}
                    r="2"
                    fill="#4b493c"
                    fillOpacity="0.55"
                  />
                ))}
                <Path d="M137 82h25v24q-12 10-25 0ZM137 87h25" fill="none" />
                {item.type === "jacket" && (
                  <Path d="M80 82h25v24q-12 10-25 0ZM80 87h25" fill="none" />
                )}
              </>
            ) : (
              <>
                <Path
                  d="M88 30q30 37 63 0l-8-4q-22 27-47 0Z"
                  fill="#000"
                  fillOpacity="0.14"
                />
                <Path d="M75 207q45 8 91 0" fill="none" />
              </>
            )}
            <Path
              d="m65 52 7 54m103-54-8 54M76 183l5-55m79 68-6-60M79 204l18 3m48-1 14-2"
              fill="none"
              strokeOpacity="0.07"
            />
            {item.type !== "tshirt" && (
              <Path d="m22 172 28 9m143 0 25-8" fill="none" />
            )}
          </>
        ) : item.type === "hat" ? (
          <>
            <Path d="M68 130 81 68Q120 40 160 68L173 130Z" />
            <Path d="M31 132Q120 105 210 132L224 153Q120 190 16 153Z" />
            <Path d="M70 120Q120 134 171 120" fill="none" />
          </>
        ) : item.type === "scarf" ? (
          <>
            <Path d="M80 33h42v174H80ZM120 46h41v161h-41Z" />
            <Path d="M80 190h42m-42 8h42m0-10h39" fill="none" />
          </>
        ) : item.type === "belt" ? (
          <>
            <Path d="M32 107h175v37H32Z" />
            <Path d="M72 100h48v51H72Z" fill="none" strokeWidth="7" />
            <Path d="M98 123h45" strokeWidth="5" />
          </>
        ) : item.type === "skirt" ? (
          <>
            <Path d="M76 38h89l39 177H37Z" />
            <Path
              d="M72 60h98m-84 7-18 138m53-138v143m31-143 23 138"
              fill="none"
            />
          </>
        ) : item.type === "shorts" ? (
          <>
            <Path d="M62 51h116l10 114-59 4-9-56-9 56-59-4Z" />
            <Path
              d="M64 68h113m-57 0v45m-29-44-25 23m83-23 26 23"
              fill="none"
            />
          </>
        ) : item.type === "trousers" ? (
          <>
            <Path d="M67 23Q120 29 174 23L181 104l-15 126-42-2-5-113-6 113-43 2-9-126Z" />
            <Path
              d="M67 23Q120 29 174 23L181 104l-15 126-42-2-5-113-6 113-43 2-9-126Z"
              fill={`url(#${uid}shade)`}
            />
            <Path
              d="M66 36q54 7 110 0M118 39v60l-8 8M87 40q0 25-23 29M155 40q0 25 22 29M88 80l-2 135M150 80l-4 135M70 219l43-2m12 0 41 2"
              fill="none"
            />
            <Path d="M79 26v16m23-14v15m34-15v15m23-16v16" strokeWidth="4" />
            <Circle cx="121" cy="33" r="2" fill="#74634c" />
          </>
        ) : ["sneakers", "loafers", "boots", "sandals"].includes(item.type) ? (
          <G transform="translate(0 -8)">
            <G transform="rotate(-22 120 110)">
              <Path
                d={
                  item.type === "boots"
                    ? "M54 55h65l-2 53 22 23 49 14q28 8 24 32H46V95Z"
                    : "M52 92q17 20 37 0l19-7 30 40 50 19q28 8 24 32H46l-5-34Z"
                }
              />
              <Path d="M43 167q85 14 168-3l2 16q-88 14-171-1Z" fill="#ece8dc" />
              <Path d="M45 176q88 12 165-3" fill="none" />
              {item.type === "sneakers" ? (
                <>
                  <Path d="m87 101 20-8 32 36-23 13Z" fill="#e4e0d5" />
                  <Path
                    d="m95 108 20-8m-12 17 20-8m-13 18 20-8m-28 27 53 5-17 13-42-8"
                    fill="none"
                    stroke="#8c8b80"
                    strokeOpacity="0.6"
                    strokeWidth="3"
                  />
                  <Path d="m155 134-7 26m-99-21 19 17" fill="none" />
                </>
              ) : (
                <Path
                  d="M75 106q30 5 65 31l-16 15q-39-8-63-26Z"
                  fill="#000"
                  fillOpacity="0.12"
                />
              )}
            </G>
            <G transform="translate(6 64) rotate(10 120 110)">
              <Path d="M49 86q15 20 36 0l21-7 30 40 54 16q27 8 23 30H43l-4-31Z" />
              <Path d="M40 157q86 13 172-3l2 16q-90 14-174-1Z" fill="#eeebe1" />
              {item.type === "sneakers" && (
                <>
                  <Path
                    d="m94 98 20-8m-12 17 20-8m-13 18 20-8m-30 26 52 6-15 12-39-7"
                    fill="none"
                    stroke="#8c8b80"
                    strokeOpacity="0.6"
                    strokeWidth="3"
                  />
                  <Path d="m156 126-8 25" fill="none" />
                </>
              )}
            </G>
          </G>
        ) : (
          <>
            <Path d="M58 83h125l-8 139H67Z" />
            <Path
              d="M88 93V59a33 33 0 0 1 66 0v34"
              fill="none"
              stroke={color}
              strokeOpacity="1"
              strokeWidth="10"
            />
            <Path d="M73 96v115m94-115-5 115M93 146h54v39H93Z" fill="none" />
          </>
        )}
      </G>
    </Svg>
  );
}
