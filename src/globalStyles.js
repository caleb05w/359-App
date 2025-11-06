import { StyleSheet } from "react-native";

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
    // bottom: 0, this just pushes it out of the app for some reason and for the love of god i cant find out why
    left: 0,
    right: 0,
    top: 100,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    elevation: 8, //shadow
  },

  page: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    flex: 1,
  },

  navBuffer: {
    marginTop: 64,
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
