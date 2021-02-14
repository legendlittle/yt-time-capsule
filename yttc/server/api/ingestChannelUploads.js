'use strict';
const video = require('../data/Video')

const {google} = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
});

/**
 * The number of days before a channel's upload list is able to be refreshed.
 */
const DAYS_BETWEEN_REFRESH = 60;

/**
 * Maximum number of videos to process per channel. This is to prevent running
 * into the YouTube API quota.
 */
const MAX_NUMBER_OF_VIDEOS_TO_INGEST = 2000;

/**
 * Given a youtube channelId, ingest video metadata for all uploads on the
 * channel. If entries already exist, does not perform ingestion unless last 
 * ingestion was more than @constant DAYS_BETWEEN_REFRESH days ago.
 */
module.exports.ingest = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const channelId = requestBody.channelId;
  
  // TODO: don't ingest if we ingested within DAYS_BETWEEN_REFRESH ago

  var playlistId;
  try {
    playlistId = await getUploadsPlaylistFromChannel(channelId);
  } catch(e) {
    const response = {
      statusCode: 500,
      body: "Error: " + e,
    }
    callback(null, response);
    return;
  }

  var videoItems;
  try {
     videoItems = await getVideosFromPlaylist(playlistId);
  } catch(e) {
    const response = {
      statusCode: 500,
      body: "Error: " + e,
    }
    callback(null, response);
    return;
  }

  // TODO: for each video in uploads playlist, add it to the db
  console.log(videoItems[1].toString());


  const response = {
    statusCode: 200,
    body: JSON.stringify(playlistId) + '\n',
  };
  callback(null,response);
};

/**
 * Returns the youtube playlistId of the channel's uploads playlist.
 * 
 * @param {string} channelId The id of the youtube channel 
 */
async function getUploadsPlaylistFromChannel(channelId) {
  console.log("Calling youtube to get playlistId for channelId " + channelId);
  const res = await youtube.channels.list({
      part: 'contentDetails',
      id: channelId,
  });

  if (res.status !== 200) {
    throw new Error("youtube.channels.list failed with code" + res.status + " and error: " + res.data)
  }

  if (!res.data.items) {
    throw new Error("No channel exists for channelId " + channelId);
  }
  const uploadsPlaylistId = res.data.items[0].contentDetails.relatedPlaylists.uploads;
  if (!uploadsPlaylistId) {
    throw new Error("No uploads playlist exists for channelId " + channelId);
  }
  console.log(`For channel ${channelId}, got uploads playlistId ${uploadsPlaylistId}`);

  return uploadsPlaylistId;
}

/**
 * Get the list of videos given a playlistId.
 * @param {string} playlistId
 * @returns {video.VideoItem[]} Array of videos in the playlist.
 */
async function getVideosFromPlaylist(playlistId) {
  console.log("Calling youtube to get videos in playlistId " + playlistId);

  var videoUploads = [];
  var nextPageToken;
  do {
    const requestOptions = {
      part: 'contentDetails,snippet',
      playlistId: playlistId,
      maxResults: 50,
    }
    if (nextPageToken) {
      requestOptions.pageToken = nextPageToken;
    }

    const response = await youtube.playlistItems.list(requestOptions);
    if (response.data.pageInfo.totalResults > MAX_NUMBER_OF_VIDEOS_TO_INGEST) {
      throw new Error("Too many videos to ingest. " +
                      `Found ${response.data.pageInfo.totalResults} results ` +
                      `in playlistId ${playlistId}` );
    }
    
    for (var item of response.data.items) {
      videoUploads.push(new video.VideoBuilder()
        .withVideoId(item.contentDetails.videoId)
        .withTitle(item.snippet.title)
        .withChannelId(item.snippet.channelId)
        .withChannelTitle(item.snippet.channelTitle)
        .withVideoPublishedAt(item.contentDetails.videoPublishedAt)
        .build()
      )
    }

    nextPageToken = response.data.nextPageToken;
  } while (nextPageToken);

  console.log(`Found ${videoUploads.length} videos in playlistId ${playlistId}`);
  return videoUploads;
}
