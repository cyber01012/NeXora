package nexora_backend.citizen.dto.request;

public class ProfileUpdateRequest {
    private String fullName;
    private String email;
    private String phone;
    private String cnic;
    private String address;
    private String city;


    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getCnic() { return cnic; }
    public String getAddress() { return address; }
    public String getCity() { return city; }

    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setCnic(String cnic) { this.cnic = cnic; }
    public void setAddress(String address) { this.address = address; }
    public void setCity(String city) { this.city = city; }
}