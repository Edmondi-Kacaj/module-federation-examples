const StreamedFederationPlugin = require("@module-federation/propriatery-tools/packages/remote-federation-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const externals = [
  require("./package.json"),
  require("../federated-middleware/package.json"),
].reduce(
  (p, c) => [...p, ...Object.keys(c.dependencies).map((d) => ({ [d]: d }))],
  []
);

module.exports = {
  mode: "production",
  target: "async-node",
  entry: { server: "./src/server.js" },
  output: {
    path: path.join(__dirname, "dist/server"),
    libraryTarget: "commonjs2",
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [".mjs", ".js", ".json"],
    alias: {
      bufferutil: false,
      encoding: false,
      "utf-8-validate": false,
    },
  },
  externals: [
    "enhanced-resolve",
    "webpack",
    "loader-runner",
    "express",
    "core-js",
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new StreamedFederationPlugin({
      name: "app1",
      library: { type: "commonjs2" },
      filename: "remoteEntry.js",
      shared: externals,
      remotes: {
        "@streamed-federation/federated-middleware":
          "@streamed-federation/federated-middleware/remoteEntry.js",
      },
    }),
  ],
};
