/**
 * Represents the different sizes of video thumbnails.
 * @enum {String}
 */
const VideoThumbnailQualityType = Object.freeze({
    DEFAULT: {
        urlSuffix: 'default.jpg',
        width: 120,
        height: 90
    },

    MEDIUM: {
        urlSuffix: 'mqdefault.jpg',
        width: 320,
        height: 180
    },

    HIGH: {
        urlSuffix: 'hqdefault.jpg',
        width: 480,
        height: 360
    },

    STANDARD: {
        urlSuffix: 'sddefault.jpg',
        width: 640,
        height: 480
    },

    MAXRES: {
        urlSuffix: 'maxresdefault.jpg',
        width: 1280,
        height: 720
    }
});

/**
 * Represents the attributes of a YouTube video.
 */
class VideoItem {
    /**
     * @param {String} videoId The unique ID of the video.
     * @param {String} title The title of the video. 
     * @param {String} channelId The ID of the channel that the video belongs to.
     * @param {String} channelTitle The title of the channel that the video belongs to.
     * @param {String} videoPublishedAt The date and time that the video was uploaded. The value is specified in ISO 8601 format.
     */
    constructor(videoId, title, channelId, channelTitle, videoPublishedAt) {
        
        this.videoId = videoId;

        this.title = title;

        this.channelId = channelId;

        this.channelTitle = channelTitle;

        this.videoPublishedAt = videoPublishedAt;
    }

    /**
     * Generates the URL containing the video's thumbnail.
     * @param {VideoThumbnailQualityType} thumbnailQuality The desired quality of the thumbnail.
     * @return {String} The thumbnail URL. 
     */
    getThumbnailUrl(thumbnailQuality = VideoThumbnailQualityType.STANDARD) {
        return "https://i.ytimg.com/vi/" + this.videoId + "/" + thumbnailQuality.urlSuffix;
    }

    toString() {
        return "Video ID: " + this.videoId + "\n"
            + "Video title: " + this.title + "\n"
            + "Video thumbnail URL: " + this.getThumbnailUrl() + "\n"
            + "Channel ID: " + this.channelId + "\n"
            + "Channel title: " + this.channelTitle + "\n"
            + "Video publish timestamp: " + this.videoPublishedAt + "\n";
    }
}

class VideoBuilder {

    withVideoId(videoId) {
        this.videoId = videoId;
        return this;
    }

    withTitle(title) {
        this.title = title;
        return this;
    }

    withChannelId(channelId) {
        this.channelId = channelId;
        return this;
    }

    withChannelTitle(channelTitle) {
        this.channelTitle = channelTitle;
        return this;
    }

    withVideoPublishedAt(videoPublishedAt) {
        this.videoPublishedAt = videoPublishedAt;
        return this;
    }

    build() {
        let verifyPropertyIsSet = function(builder, nameOfProperty) {
            if (!(nameOfProperty in builder)) {
                throw new Error("Missing property " + nameOfProperty);
            }
        }
        verifyPropertyIsSet(this, 'videoId');
        verifyPropertyIsSet(this, 'title');
        verifyPropertyIsSet(this, 'channelId');
        verifyPropertyIsSet(this, 'channelTitle');
        verifyPropertyIsSet(this, 'videoPublishedAt');

        return new VideoItem(
            this.videoId,
            this.title,
            this.channelId,
            this.channelTitle,
            this.videoPublishedAt
        )
    }
}

module.exports = {VideoThumbnailQualityType, VideoItem, VideoBuilder}