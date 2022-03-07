const { postQueue } = require("../db/post-db");
const { HttpNotFoundError } = require("../utils/errors");
const igService = require("./ig-service");

// Processes

postQueue.process("photo", function (job) {
  const { post, session } = job.data;
  return igService.uploadPhoto(post, session);
});

postQueue.process("video", function (job) {
  const { post, session } = job.data;
  return igService.uploadVideo(post, session);
});

postQueue.process("storyPhoto", function (job) {
  const { post, session } = job.data;
  return igService.uploadStoryPhoto(post, session);
});

postQueue.process("storyVideo", function (job) {
  const { post, session } = job.data;
  return igService.uploadStoryVideo(post, session);
});

postQueue.process("carousel", function (job) {
  const { post, session } = job.data;
  return igService.uploadCarousel(post, session);
});

postQueue.process("igtvVideo", function (job) {
  const { post, session } = job.data;
  return igService.uploadIgtvVideo(post, session);
});

// Events

postQueue.on("error", function (error) {
  // An error occured
  throw error;
});

postQueue.on("active", function (job, _) {
  // A job has started
  console.log(`Posting ${job.data.post.type}`, job.data);
});

postQueue.on("completed", function (job, _) {
  // A job successfully completed
  console.log(`Successfully posted ${job.data.post.type}`, job.data);
});

postQueue.on("failed", function (job, err) {
  // A job failed
  console.log(`Failed to post ${job.data.post.type}`, err);
});

postQueue.on("removed", function (job) {
  // A job successfully removed.
  console.log(`Removed ${job.data.post.type}`, job.data);
});

// Logic

async function schedulePost(post, session, timestamp, delay) {
  const { type } = post;
  return await postQueue.add(type, { post, session, timestamp }, { delay });
}

async function getScheduledPost(id) {
  const job = await postQueue.getJob(id);
  if (!job) {
    throw new HttpNotFoundError(`Job with ID '${id}' doesn't exist`);
  }
  return job;
}

async function getScheduledPosts(status, start, end) {
  return await postQueue.getJobs([status], start, end, true);
}

async function deleteScheduledPost(id) {
  (await getScheduledPost(id)).remove();
}

module.exports = {
  schedulePost,
  getScheduledPost,
  getScheduledPosts,
  deleteScheduledPost,
};
