package uk.gov.etsgw.api.web.controller.uiconfiguration;

import lombok.Builder;
import lombok.Data;

import org.springframework.validation.annotation.Validated;
import uk.gov.etsgw.api.notification.alert.NotificationAlertDTO;

import java.util.List;
import java.util.Map;

@Validated
@Data
@Builder
public class UIPropertiesDTO {
	private Map<String, Boolean> features;
    private Map<String, String> analytics;
    private String keycloakServerUrl;
    private List<NotificationAlertDTO> notificationAlerts;

}
