'use strict';

// const AWS = require('aws-sdk');
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
    playlistId = await getUploadsPlaylistId(channelId);
  } catch(e) {
    const response = {
      statusCode: 500,
      body: "Error: " + e,
    }
    callback(null, response);
    return;
  }
  
  const response = {
      statusCode: 200,
      body: JSON.stringify(playlistId),
  };

  // TODO: for each video in uploads playlist, add it to the db

  callback(null,response);
};

/**
 * Returns the youtube playlistId of the channel's uploads playlist.
 * 
 * @param {string} channelId The id of the youtube channel 
 */
async function getUploadsPlaylistId(channelId) {
  console.log("Calling youtube to get playlistId for channelId " + channelId);
  const res = await youtube.channels.list({
      part: 'contentDetails',
      id: channelId,
  });

  console.log('Status code: ' + res.status);
  console.log(res.data);

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
  console.log("Got playlistId: " + uploadsPlaylistId);

  return uploadsPlaylistId;
}