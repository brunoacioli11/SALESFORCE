import { LightningElement, api, wire} from 'lwc';
import getCourseRelatedRecordsById from '@salesforce/apex/CustomRelatedListController.getCourseRelatedRecordsById';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomRelatedList extends NavigationMixin(LightningElement) {

    @api recordId;

    status = 'All';
    showRecords = true;
    recordsToDisplay = [];
    totalRecords = [];
    recordPageUrl;
    currentText = '';

    filterOptions = [
        { label: 'All', value: 'All'},
        { label: 'Student Enrollment', value: 'Student_Enrollment__c' },
        { label: 'Attendance Record', value: 'Attendance_Record__c' }
    ]; 
    
    get cardLabel() {
        return 'Related Records';
    }
 
 
    @wire(getCourseRelatedRecordsById, {
        parentId:'$recordId'
    })
    wiredCases({data, error}){
        if (data) {
            console.log(data);
            Object.keys(data).map(element => {
                console.log(element);
                var record = data[element];
                this.totalRecords.push({
                    ObjectName: 'Student_Enrollment__c',
                    Id: record.Id,
                    RecordName: record.Name,
                    RecordStatus: record.Status__c,
                    RecordDate: record.Enrollment_Date__c
                })
                if(record.Attendance_Records__r != undefined) {
                    record.Attendance_Records__r.forEach(childRecord => {
                        this.totalRecords.push({
                            ObjectName: 'Attendance_Record__c',
                            Id: childRecord.Id,
                            RecordName: childRecord.Name,
                            RecordStatus: childRecord.Status__c,
                            RecordDate: childRecord.Attendance_Date__c
                        })
                    })
                }
            })
          
            this.recordsToDisplay = this.totalRecords;
        }
        if (error) {
            console.error('Error occurred retrieving records...');
        }
    }
 
 
    handleSelection(event) {
        this.status = event.detail.value;
        console.log(this.status);
        this.updateList();
    }
 
 
    updateList() {
        if (this.status === 'All') {
            this.recordsToDisplay = this.totalRecords.filter(elem => elem.RecordName.toLowerCase().includes(this.currentText.toLowerCase()));
        } else if(this.currentText == undefined) {
            this.recordsToDisplay = this.totalRecords.filter(elem => elem.ObjectName == this.status);
        } else {
            this.recordsToDisplay = this.totalRecords.filter(elem => elem.RecordName.toLowerCase().includes(this.currentText.toLowerCase())
                                                    && elem.ObjectName == this.status);
        } 
        this.showRecords = this.recordsToDisplay.length > 0 ? true : false;
    }

    handleRecordURL(event) {
         this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.id,
                actionName: 'view',
            },
        }).then((url) => {
            this.recordPageUrl = url;
        });
    }

    handleSearch(event) {
        this.currentText = event.target.value;
        this.updateList(); 
    }
}