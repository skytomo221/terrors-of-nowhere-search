const imagesContext = require.context("./assets/images", false, /\.png$/);
const images = imagesContext
  .keys()
  .reduce<{ [key: string]: any }>((images, path) => {
    // ファイル名をキーとして画像を格納します
    const key = path.replace("./", "").replace(".png", "").replace(".gif", "");
    images[key] = imagesContext(path);
    return images;
  }, {});
export default images;
