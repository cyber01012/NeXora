package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complaint_nature")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintNature {

    @Id
    private Integer id;

    private String description;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private ComplaintType type;

    // MANUAL GETTERS & SETTERS
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ComplaintType getType() { return type; }
    public void setType(ComplaintType type) { this.type = type; }
}