const imagesContext = require.context("./assets/images", false, /\.(png|gif)$/);
const images = imagesContext
  .keys()
  .reduce<{ [key: string]: any }>((images, path) => {
    // ファイル名をキーとして画像を格納します
    const key = path.replace("./", "").replace(/.(png|gif)$/, "")
    // eslint-disable-next-line no-param-reassign
    images[key] = imagesContext(path);
    return images;
  }, {});
export default images;
