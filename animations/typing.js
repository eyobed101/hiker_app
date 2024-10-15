import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const TypingIndicator = () => {
  const animationData = {
    v: "5.5.2",
    fr: 60,
    ip: 0,
    op: 104,
    w: 84,
    h: 40,
    nm: "Typing-Indicator",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Oval 3",
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              { i: { x: [0.643], y: [1] }, o: { x: [1], y: [0] }, t: 18, s: [35], e: [100] },
              { i: { x: [0.099], y: [1] }, o: { x: [0.129], y: [0] }, t: 33, s: [100], e: [35] },
              { i: { x: [0.833], y: [1] }, o: { x: [0.167], y: [0] }, t: 65, s: [35], e: [35] },
              { t: 71 }
            ],
            ix: 11,
          },
          r: { a: 0, k: 0, ix: 10 },
          p: { a: 0, k: [61, 20, 0], ix: 2 },
          a: { a: 0, k: [0, 0, 0], ix: 1 },
          s: {
            a: 1,
            k: [
              { i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [1, 1, 0.333], y: [0, 0, 0] }, t: 18, s: [100, 100, 100], e: [140, 140, 100] },
              { i: { x: [0.032, 0.032, 0.667], y: [1, 1, 1] }, o: { x: [0.217, 0.217, 0.333], y: [0, 0, 0] }, t: 33, s: [140, 140, 100], e: [100, 100, 100] },
              { i: { x: [0.833, 0.833, 0.833], y: [1, 1, 1] }, o: { x: [0.167, 0.167, 0.167], y: [0, 0, 0] }, t: 65, s: [100, 100, 100], e: [100, 100, 100] },
              { t: 71 }
            ],
            ix: 6,
          },
        },
        shapes: [
          {
            ty: "gr",
            it: [
              { d: 1, ty: "el", s: { a: 0, k: [12, 12], ix: 2 }, p: { a: 0, k: [0, 0], ix: 3 }, nm: "Ellipse Path 1", mn: "ADBE Vector Shape - Ellipse", hd: false },
              { ty: "fl", c: { a: 0, k: [0.847, 0.847, 0.847, 1], ix: 4 }, o: { a: 0, k: 100, ix: 5 }, r: 1, bm: 0, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill", hd: false },
              { ty: "tr", p: { a: 0, k: [0, 0], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" }
            ],
            nm: "Oval 3",
            np: 2,
            cix: 2,
            bm: 0,
            ix: 1,
            mn: "ADBE Vector Group",
            hd: false,
          }
        ],
        ip: 0,
        op: 3600,
        st: 0,
        bm: 0,
      },
      // Repeat the structure for other layers (Oval 2, Oval 1, etc.)
      // ...
    ],
    ip: 0,
    op: 3600,
    st: 0,
    bm: 0,
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={animationData}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  animation: {
    width: 84, // or any width you prefer
    height: 40, // or any height you prefer
  },
});

export default TypingIndicator;
