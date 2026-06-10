package nexora_backend.auth.schema;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Getter
@Builder
public class EntityFieldMetadata {

    private final String fieldName;
    private final String columnName;
    private final boolean required;
    private final boolean unique;
    private final boolean sensitive;
    private final boolean writeOnly;

    public static List<EntityFieldMetadata> fromEntity(Class<?> entityClass, Set<String> excludedFields) {
        List<EntityFieldMetadata> fields = new ArrayList<>();
        for (Field field : entityClass.getDeclaredFields()) {
            if (excludedFields.contains(field.getName()) || field.getName().equals("id")) {
                continue;
            }
            Column column = field.getAnnotation(Column.class);
            boolean required = column != null && !column.nullable();
            boolean unique = column != null && column.unique();
            String columnName = column != null && !column.name().isBlank() ? column.name() : field.getName();

            fields.add(EntityFieldMetadata.builder()
                    .fieldName(field.getName())
                    .columnName(columnName)
                    .required(required)
                    .unique(unique)
                    .sensitive(isSensitive(field.getName()))
                    .writeOnly(isWriteOnly(field.getName()))
                    .build());
        }
        fields.sort(Comparator.comparing(EntityFieldMetadata::getFieldName));
        return fields;
    }

    private static boolean isSensitive(String fieldName) {
        return Arrays.asList("phoneNumber", "contactNumber", "cnic").contains(fieldName);
    }

    private static boolean isWriteOnly(String fieldName) {
        return "password".equals(fieldName);
    }
}
