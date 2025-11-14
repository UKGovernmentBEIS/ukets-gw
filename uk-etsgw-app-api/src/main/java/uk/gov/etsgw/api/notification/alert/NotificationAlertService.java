package uk.gov.etsgw.api.notification.alert;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class NotificationAlertService {

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public List<NotificationAlertDTO> getNotificationAlerts() {
        try {
            String alertSubject = System.getenv("ALERT_SUBJECT");
            String alertBody = System.getenv("ALERT_BODY");
            String alertActiveFromString = System.getenv("ALERT_ACTIVE_FROM");
            String alertActiveUntilString = System.getenv("ALERT_ACTIVE_UNTIL");

            if (StringUtils.isNotBlank(alertSubject) && StringUtils.isNotBlank(alertBody) && StringUtils.isNotBlank(alertActiveFromString) && StringUtils.isNotBlank(alertActiveUntilString)) {
                LocalDateTime currentDate = LocalDateTime.now();
                LocalDateTime alertActiveFrom = LocalDateTime.parse(alertActiveFromString, formatter);
                LocalDateTime alertActiveUntil = LocalDateTime.parse(alertActiveUntilString, formatter);

                if (currentDate.isAfter(alertActiveFrom) && currentDate.isBefore(alertActiveUntil)) {
                    return Collections.singletonList(NotificationAlertDTO.builder().subject(alertSubject).body(alertBody).build());
                }
            }
            return Collections.emptyList();
        } catch (Exception ex) {
            log.error(ex.getMessage());
            return Collections.emptyList();
        }
    }
}
