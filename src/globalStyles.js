//gobal style sheet for consistency.

import { StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
//because apparently, you can't use 100vh on react expo lol
const { height } = Dimensions.get("window");

export const GradientBackground = ({ children }) => {
  return (
    <LinearGradient colors={["#fff6ebff", "#c0ebffff"]} style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
};

export default StyleSheet.create({

  h1: {
    fontFamily: "departure mono",
    fontSize: 36,
    color: "white",
  },

  h2: {
    fontFamily: "departure mono",
    fontSize: 24,
    color: "white",
  },

  h3: {
    fontFamily: "departure mono",
    fontSize: 15,
    color: "#bdbdbdff"
  },

  h4: {
    fontFamily: "departure mono",
    borderWidth: 2,
    borderColor: "#bdbdbdff",
    paddingVertical: 15,
    marginBottom: 25,
    color: "white"
  },

  h5: {
    fontFamily: "departure mono",
    color: "#121212ff",
    fontSize: 15,
  },

  colorBox: {
    height: 40,
    width: 40,
    borderColor: "#111",
    borderRadius: 8,
    backgroundColor: "red",
  },

  navBar: {
    position: "absolute",
    bottom: 60 - height,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    elevation: 8, //shadow
  },

  view: {
    position: "relative",
    height: height,
  },

  padding: {
    padding: 40,
  },

  page: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },

  flexRow: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  flexCol: {
    display: "flex",
    flexDirection: "col",
    gap: 12,
  },
  upload: {
    borderColor: "#D9D9D9",
    borderWidth: 2,

  },

  fill: {
    width: "100%",
  },

  center: {
    height: "fit",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },

  m12: {
    margin: 12,
  },

  border: {
    borderColor: "black",
    borderWidth: 2,
  },

  listItem: {
    marginTop: 8, width: 100, height: 100, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'
  }

});
