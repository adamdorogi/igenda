const postService = require("../services/post-service");
const { HttpBadRequestError } = require("../utils/errors");

async function formatJob(job) {
  return { id: job.id, state: await job.getState(), ...job.data };
}

function validatePhoto(post) {
  const { photoUrl } = post;

  // Validate required options
  if (!photoUrl) {
    throw new HttpBadRequestError("Missing photo URL");
  }
}

function validateVideo(post) {
  const { videoUrl, thumbnailUrl } = post;

  // Validate required options
  if (!videoUrl) {
    throw new HttpBadRequestError("Missing video URL");
  }
  if (!thumbnailUrl) {
    throw new HttpBadRequestError("Missing cover image URL");
  }
}

function validateCarousel(post) {
  const { items } = post;

  // Validate required options
  if (!items) {
    throw new HttpBadRequestError("Missing carousel items");
  }
  for (const item of items) {
    const { type } = item;
    switch (type) {
      case "photo":
        validatePhoto(item);
        break;
      case "video":
        validateVideo(item);
        break;
      default:
        throw new HttpBadRequestError("Invalid post type in carousel");
    }
  }
}

function validateIgtvVideo(post) {
  validateVideo(post);

  const { title } = post;

  // Validate required options
  if (!title) {
    throw new HttpBadRequestError("Missing title");
  }
}

async function postPost(req, res, next) {
  const { session, timestamp, post } = req.body;

  try {
    // Check session
    if (!session) {
      throw new HttpBadRequestError("Missing session");
    }

    // Validate timestamp
    const delay = timestamp - Date.now();
    if (isNaN(delay) || delay < 0) {
      throw new HttpBadRequestError("Timestamp must be in the future");
    }

    // Check post
    if (!post) {
      throw new HttpBadRequestError("Missing post");
    }

    const { type } = post;

    switch (type) {
      case "photo":
      case "storyPhoto":
        validatePhoto(post);
        break;
      case "video":
      case "storyVideo":
        validateVideo(post);
        break;
      case "carousel":
        validateCarousel(post);
        break;
      case "igtvVideo":
        validateIgtvVideo(post);
        break;
      default:
        throw new HttpBadRequestError("Invalid post type");
    }

    const job = await postService.schedulePost(post, session, timestamp, delay);
    const result = await formatJob(job);
    res.status(201).send(result);
    next();
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  const { id } = req.params;

  try {
    const job = await postService.getScheduledPost(id);
    const response = await formatJob(job);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
}

async function getPosts(req, res, next) {
  const { status, start, end } = req.query;

  try {
    const jobs = await postService.getScheduledPosts(status, start, end);
    const response = await Promise.all(jobs.map(formatJob));
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  const { id } = req.params;

  try {
    await postService.deleteScheduledPost(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  postPost,
  getPost,
  getPosts,
  deletePost,
};
