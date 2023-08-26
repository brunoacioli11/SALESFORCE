public class YoutubeData {
    public List<YoutubeData.Item> items;
    public class Response {
        public String kind;
        public String etag;
        public String nextPageToken;
        public String regionCode;
        public YoutubeData.PageInfo pageInfo;
        public List<YoutubeData.Item> items;
    }

    public class PageInfo {
        public Integer totalResults;
        public Integer resultsPerPage;
    }

    public class Item {
        public String kind;
        public String etag;
        public YoutubeData.Id id;
        public YoutubeData.Snippet snippet;
    }

    public class Id {
        public String kind;
        public String videoId;
    }

    public class Snippet {
        Datetime publishedAt;
        public String channelId;
        public String title;
        public String description;
        public YoutubeData.Thumbnails thumbnails;
        public String channelTitle;
        public String liveBroadcastContent;
    }

    public class Thumbnails {
        public YoutubeData.Thumbnail medium;
        public YoutubeData.Thumbnail high;
    }

    public class Thumbnail {
        public String url;
    }
}