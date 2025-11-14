package uk.gov.etsgw.api.security;

import org.springframework.context.annotation.Primary;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@Primary
@RequiredArgsConstructor
public class AppSecurityComponent {

    public AppUser getAuthenticatedUser() {
        Jwt jwt = getToken();
        return AppUser.builder()
        		.userId(jwt.getClaimAsString(JwtClaimNames.SUB))
        		.firstName(jwt.getClaimAsString("given_name"))
        		.lastName(jwt.getClaimAsString("family_name"))
        		.build();
    }

    public String getAccessToken() {
        return getToken().getTokenValue();
    }

    private Jwt getToken() {
        return (Jwt)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

}
