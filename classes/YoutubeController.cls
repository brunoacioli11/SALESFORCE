public with sharing class YoutubeController {
    private final static Youtube_API_Setting__c apiSetting = Youtube_API_Setting__c.getInstance();
    private static final String SEARCH_URL = apiSetting.Youtube_API_Endpoint__c;
    private static final String API_KEY =apiSetting.Youtube_API_Key__c; 

    @AuraEnabled(cacheable=true)
    public static List<MyWrapper> getYoutubeVideos(String searchKey){
        searchKey = searchKey == null ? 'salesforce': searchKey;

        List<MyWrapper> wrpList = new List<MyWrapper>();

        Http http = new http();
        HttpRequest request = new HttpRequest();
        String endpoint = SEARCH_URL + '?part=snippet' + '&maxResults=20' + '&type=video' + '&q=' + EncodingUtil.urlEncode(searchKey, 'UTF-8') + '&key=' + API_KEY;

        request.setEndpoint(endpoint);
        request.setMethod('GET');
        HttpResponse res = http.send(request);

        System.debug(res.getStatusCode());

        if(res.getStatusCode() == 200) {
            Map<String,Object> results = (Map<String,Object>) JSON.deserializeUntyped(res.getBody());
            System.debug(results);
            YoutubeData.Response response = (YoutubeData.Response)JSON.deserialize(res.getBody(), YoutubeData.Response.class);
            List<YoutubeData.Item> itemList = response.items;


            for(YoutubeData.Item item: itemList) {
                MyWrapper youtubeWrapper = new MyWrapper();
                youtubeWrapper.videoId = item.id.videoId;
                youtubeWrapper.description = item.snippet.description;
                youtubeWrapper.thumbnails = item.snippet.thumbnails.medium.url;
                youtubeWrapper.title = item.snippet.title;
                youtubeWrapper.channelTitle = item.snippet.channelTitle;

                wrpList.add(youtubeWrapper);
            }
        }

        return wrpList;
    }


    public class MyWrapper{
        @AuraEnabled public string videoId;
        @AuraEnabled public string description;
        @AuraEnabled public string thumbnails;
        @AuraEnabled public string title;
        @AuraEnabled public string channelTitle;
        @AuraEnabled public string publishedAt;
    }
}