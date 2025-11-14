package uk.gov.etsgw.api.security;

import io.swagger.v3.oas.annotations.Hidden;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Hidden
public class AppUser {

    private String userId;

    private String firstName;

    private String lastName;

    public String getFullName() {
        return firstName + " " + lastName;
    }
}