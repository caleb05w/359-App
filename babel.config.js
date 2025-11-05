module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    //added in to allow and convert tailwinda
    plugins: ["nativewind/babel"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
