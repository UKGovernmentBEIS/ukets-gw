package uk.gov.etsgw.api.security.config;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
public class ApiSecurityConfig {

    private final SecurityProperties securityProperties;

	public ApiSecurityConfig(SecurityProperties securityProperties) {
		this.securityProperties = securityProperties;
	}

    @Bean
    @Order(2)
    public SecurityFilterChain applicationSecurityFilterChain(HttpSecurity http) throws Exception {
        RequestMatcher[] unauthenticatedRequestMatchers = securityProperties.getUnauthenticatedApis().stream()
                .map(AntPathRequestMatcher::antMatcher)
                .toList()
                .toArray(RequestMatcher[]::new);

        http
                .sessionManagement(httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .headers(httpSecurityHeadersConfigurer -> httpSecurityHeadersConfigurer.httpStrictTransportSecurity(hstsConfig -> hstsConfig.includeSubDomains(true)))
                .authorizeHttpRequests(authorize -> authorize.requestMatchers(unauthenticatedRequestMatchers).permitAll())
                .authorizeHttpRequests(authorize -> authorize.requestMatchers(antMatcher("/**")).authenticated())
                .oauth2ResourceServer(etsGwOAuthCustomizer());
        return http.build();
    }
    
    @Bean
    Customizer<OAuth2ResourceServerConfigurer<HttpSecurity>> etsGwOAuthCustomizer(){
		return oauth2 -> oauth2.jwt(Customizer.withDefaults());
    }
	
    @Bean
    JwtDecoder etsGwJwtDecoder(OAuth2ResourceServerProperties properties) {
        return NimbusJwtDecoder.withJwkSetUri(
                properties.getJwt().getJwkSetUri()).build();
    }

}
