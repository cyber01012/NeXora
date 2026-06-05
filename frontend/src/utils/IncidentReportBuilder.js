export class IncidentReportBuilder {
  constructor() {
    this.report = {
      type: '',
      description: '',
      locationAddress: '',
      city: '',
      area: '',
      province: 'Sindh',
      district: '',
      town: '',
      mediaPath: '',
      latitude: null,
      longitude: null
    };
  }

  setType(type) {
    this.report.type = type;
    return this;
  }

  setDescription(description) {
    this.report.description = description;
    return this;
  }

  setLocation(locationAddress) {
    this.report.locationAddress = locationAddress;
    return this;
  }

  setCity(city) {
    this.report.city = city;
    return this;
  }

  setArea(area) {
    this.report.area = area;
    return this;
  }

  setProvince(province) {
    this.report.province = province;
    return this;
  }

  setDistrict(district) {
    this.report.district = district;
    return this;
  }

  setTown(town) {
    this.report.town = town;
    return this;
  }

  setEvidence(mediaPath) {
    this.report.mediaPath = mediaPath;
    return this;
  }

  setLatitude(lat) {
    this.report.latitude = lat;
    return this;
  }

  setLongitude(lng) {
    this.report.longitude = lng;
    return this;
  }

  build() {
    // If locationAddress is not set but city and area are, construct it
    if (!this.report.locationAddress && this.report.city && this.report.area) {
      this.report.locationAddress = `${this.report.area}, ${this.report.city}`;
    }
    return { ...this.report };
  }
}
