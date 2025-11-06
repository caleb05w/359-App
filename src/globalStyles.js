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
    bottom: 0, 
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    elevation: 8, // shadow
  },

  page: {
    flex: 1, 
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80, 
    gap: 24,
  },
});
