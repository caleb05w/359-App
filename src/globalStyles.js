import { StyleSheet, Dimensions } from "react-native";
//because apparently, you can't use 100vh on react expo lol
const { height } = Dimensions.get("window");

export default StyleSheet.create({
  colorBox: {
    height: 40,
    width: 40,
    borderColor: "#111",
    borderRadius: 8,
    backgroundColor: "red",
  },

  navBar: {
    position: "absolute",
    bottom: 110 - height,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    elevation: 8, //shadow
  },

  view: {
    position: "relative",
    borderColor: "red",
    borderWidth: 2,
    height: height,
  },

  page: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    flex: 1,
  },

  test: {
    borderColor: "red",
    borderWidth: 2,
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
});
