export class CreateEvent {
    name: string;
    longitude: number;
    latitude: number;
    address: string;
    details: string;

    constructor(name: string, address: string, details: string) {
        this.name = name;
        this.address = address;
        this.details = details;      
    }
 }