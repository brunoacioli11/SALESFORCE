import { LightningElement, track } from 'lwc';
import getYoutubeVideos from '@salesforce/apex/YoutubeController.getYoutubeVideos';
export default class YoutubeSearchPlayer extends LightningElement {
    @track finalResult = [];
    @track finalError = '';
    @track searchInput = 'salesforce trailblazer';
    @track videoResults = [];
    @track viewUrl = '';
    showIframe = false;

    connectedCallback() {
        this.handleSubmit();
    }

    handleSearch(event) {
        this.searchInput = event.target.value;
        console.log('This is searchInput: ' + this.searchInput);
    }

    handleSubmit() {
        getYoutubeVideos({searchKey: this.searchInput})
        .then((results) => {
            this.videoResults = results;
            console.log('This is final video results: ' + JSON.stringify(this.videoResults));

            if(this.videoResults.length > 0) {
                this.showVideoInIframe(this.videoResults[0].videoId);
            }
        })
        .catch((error) => {
            this.finalError = error.body.message;
            console.log('This is final video result: ' + this.finalError);
        })
    }

    showVideoInIframe(videoId) {
        this.viewUrl = 'https://www.youtube.com/embed/' + videoId;
    }

    watchVideo(event) {
        let slt = event.currentTarget.dataset.id;
        console.log('This is selected video: ' + slt);
        this.showIframe = true;
        console.log('Entreeeeeeeeei');
        console.log(this.showIframe);
        const div1 = this.template.querySelector('[data-id="div1"]');
        const div2 = this.template.querySelector('[data-id="div2"]');
        const div3 = this.template.querySelector('[data-id="div3"]');
        div1.classList.add("slds-grid");
        div1.classList.add("slds-gutters")
        div2.classList.add("slds-border_left");
        div3.classList.add("slds-col");
        div3.classList.add("slds-size_1-of-3");
        div3.style.width = '98%';
        this.viewUrl = 'https://www.youtube.com/embed/' + slt;
    }
}