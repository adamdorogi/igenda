# igenda

An Node.js server for scheduling Instagram posts using [Express.js](https://github.com/expressjs/express), [Bull](https://github.com/OptimalBits/bull), and [Instagram Private API](https://github.com/dilame/instagram-private-api).

## Endpoints

### `POST /posts`

Schedule an Instagram post.

#### Body Parameters

```json
{
  "timestamp": 0, // Timestamp of post to schedule
  "post": {
    // See below for post type
  },
  "session": {
    // State data of an `IgApiClient` from Instagram Private API
  }
}
```

##### Photo

```json
{
  "type": "photo",
  "photoUrl": "", // URL of JPG image
  "caption": "", // Caption of photo (optional)
  "location": {
    // Post location data from Instagram Private API (optional)
  },
  "tags": {
    // Post user tags data from Instagram Private API (optional)
  }
}
```

##### Video

```json
{
  "type": "video",
  "videoUrl": "", // URL of MP4 video
  "thumbnailUrl": "", // URL of JPG thumbnail image
  "caption": "", // Caption of video (optional)
  "location": {
    // Post location data from Instagram Private API (optional)
  },
  "tags": {
    // Post user tags data from Instagram Private API (optional)
  }
}
```

##### Story Photo

```json
{
  "type": "storyPhoto",
  "photoUrl": "", // URL of JPG image
  "stickerConfig": {
    // Sticker configuration data from Instagram Private API (optional)
  }
}
```

##### Story Video

```json
{
  "type": "storyVideo",
  "videoUrl": "", // URL of MP4 video
  "thumbnailUrl": "", // URL of JPG thumbnail image
  "stickerConfig": {
    // Sticker configuration data from Instagram Private API (optional)
  }
}
```

##### Carousel

```json
{
  "type": "carousel",
  "caption": "", // Caption of post (optional)
  "items": [
    // Array of "Photo" or "Video" objects (without caption or location)
  ],
  "location": {
    // Post location data from Instagram Private API (optional)
  }
}
```

##### IGTV

> Deprecated

```json
{
  "type": "igtvVideo",
  "videoUrl": "", // URL of MP4 video
  "thumbnailUrl": "", // URL of JPG thumbnail image
  "title": "", // Title of video
  "caption": "", // Caption of video (optional)
  "audioMuted": true, // Whether audio should be muted (optional)
  "shareToFeed": true, // Whether video should be shared to feed (optional)
  "feedPreviewCrop": {
    // Feed preview crop data from Instagram Private API (optional)
  }
}
```

### `GET /posts`

Get all scheduled Instagram posts.

#### Query Parameters

- `status`: Filter by status of scheduled posts. Possible options are: `completed`, `failed`, `delayed`, `active`, `waiting`, `paused`, `stuck` or `null`.
- `start`: Start range of scheduled posts to get (inclusive).
- `end`: End range of scheduled posts to get (inclusive).

### `GET /posts/:id`

Get a scheduled Instagram post by `id`.

### `DELETE /posts/:id`

Delete a scheduled Instagram post by `id`.
