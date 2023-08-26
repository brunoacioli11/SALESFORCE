// filteredRelatedCaseList.js
import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
 
 
export default class FilteredRelatedCaseList extends LightningElement {
 
 
    @api recordId;
 
 
    filterOptions = [
        { label: 'All', value: 'All'},
        { label: 'Closed', value: 'Closed' },
        { label: 'New', value: 'New' },
        { label: 'Working', value: 'Working' },
        { label: 'Escalated', value: 'Escalated' }
    ];
    
    cases = [];
    casesToDisplay = [];
    status = 'All';
    showCases = false;
    
    get cardLabel() {
        return 'Related Cases (' + this.cases.length + ')';
    }
 
 
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Cases',
        fields: ['Case.Id', 'Case.CaseNumber', 'Case.Subject', 'Case.Status', 'Case.Priority']
    })
    wiredCases({data, error}){
        if (data) {
            this.cases = data.records;
            this.updateList();
            this.dispatchEvent(new CustomEvent('casecount', { detail: this.cases.length}));
        }
 
 
        if (error) {
            console.error('Error occurred retrieving Case records...');
        }
    }
 
 
    handleSelection(event) {
        this.status = event.detail.value;
        this.updateList();
    }
 
 
    updateList() {
        if (this.status === 'All') {
            this.casesToDisplay = this.cases;
        } else {
            this.casesToDisplay = this.cases.filter(elem => elem.fields.Status.value == this.status);
        }
 
 
        this.showCases = this.casesToDisplay.length > 0 ? true : false;
    }
}