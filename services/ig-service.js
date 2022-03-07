const { IgApiClient } = require("instagram-private-api");
const request = require("request-promise");

async function getPhotoOptions(post) {
  const { photoUrl, caption, location, tags } = post;

  // Getting image from internet as a Buffer
  const file = await request.get({ url: photoUrl, encoding: null });

  return { file, caption, location, usertags: tags };
}

async function getVideoOptions(post) {
  const { videoUrl, thumbnailUrl, caption, location, tags } = post;

  // Getting video from internet as a Buffer
  const video = await request.get({ url: videoUrl, encoding: null });

  // Getting image from internet as a Buffer
  const coverImage = await request.get({ url: thumbnailUrl, encoding: null });

  return { video, coverImage, caption, location, usertags: tags };
}

async function getStoryPhotoOptions(post) {
  const { photoUrl, stickerConfig } = post;

  // Getting image from internet as a Buffer
  const file = await request.get({ url: photoUrl, encoding: null });

  return { file, stickerConfig };
}

async function getStoryVideoOptions(post) {
  const { videoUrl, thumbnailUrl, stickerConfig } = post;

  // Getting video from internet as a Buffer
  const video = await request.get({ url: videoUrl, encoding: null });

  // Getting image from internet as a Buffer
  const coverImage = await request.get({ url: thumbnailUrl, encoding: null });

  return { video, coverImage, stickerConfig };
}

async function getIgtvVideoOptions(post) {
  const {
    videoUrl,
    thumbnailUrl,
    title,
    caption,
    audioMuted,
    shareToFeed,
    feedPreviewCrop,
  } = post;

  // Getting video from internet as a Buffer
  const video = await request.get({ url: videoUrl, encoding: null });

  // Getting image from internet as a Buffer
  const coverFrame = await request.get({ url: thumbnailUrl, encoding: null });

  return {
    video,
    coverFrame,
    title,
    caption,
    audioMuted,
    shareToFeed,
    feedPreviewCrop,
  };
}

async function uploadPhoto(post, session) {
  const ig = new IgApiClient();
  await ig.state.deserialize(session);

  const photoOptions = await getPhotoOptions(post);
  return await ig.publish.photo(photoOptions);
}

async function uploadVideo(post, session) {
  const ig = new IgApiClient();
  await ig.state.deserialize(session);

  const videoOptions = await getVideoOptions(post);
  return await ig.publish.video(videoOptions);
}

async function uploadStoryPhoto(post, session) {
  const ig = new IgApiClient();
  await ig.state.deserialize(session);

  const storyPhotoOptions = await getStoryPhotoOptions(post);
  return await ig.publish.story(storyPhotoOptions);
}

async function uploadStoryVideo(post, session) {
  const ig = new IgApiClient();
  await ig.state.deserialize(session);

  const storyVideoOptions = await getStoryVideoOptions(post);
  return await ig.publish.story(storyVideoOptions);
}

async function uploadCarousel(post, session) {
  const ig = new IgApiClient();
  await ig.state.deserialize(session);

  const { items, caption, location } = post;

  const carouselItems = await Promise.all(
    items.map(async function (item) {
      const { type } = item;
      switch (type) {
        case "photo":
          return await getPhotoOptions(item);
        case "video":
          return await getVideoOptions(item);
      }
    })
  );

  return await ig.publish.album({
    items: carouselItems,
    caption,
    location,
  });
}

async function uploadIgtvVideo(post, session) {
  const ig = new IgApiClient();
  await ig.state.deserialize(session);

  const igtvVideoOptions = await getIgtvVideoOptions(post);
  return await ig.publish.igtvVideo(igtvVideoOptions);
}

module.exports = {
  uploadPhoto,
  uploadVideo,
  uploadStoryPhoto,
  uploadStoryVideo,
  uploadCarousel,
  uploadIgtvVideo,
};
