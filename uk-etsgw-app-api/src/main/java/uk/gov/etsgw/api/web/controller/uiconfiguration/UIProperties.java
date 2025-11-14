package uk.gov.etsgw.api.web.controller.uiconfiguration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import java.util.Map;

@Component
@Validated
@ConfigurationProperties(prefix = "ui")
@Getter
@Setter
public class UIProperties {
	private Map<String, Boolean> features;
    private Map<String, String> analytics;
    private String keycloakServerUrl;
}
