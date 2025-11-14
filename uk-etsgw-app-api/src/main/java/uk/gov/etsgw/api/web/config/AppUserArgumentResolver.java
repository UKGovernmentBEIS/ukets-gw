package uk.gov.etsgw.api.web.config;

import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import uk.gov.etsgw.api.security.AppSecurityComponent;
import uk.gov.etsgw.api.security.AppUser;

@Component
@RequiredArgsConstructor
public class AppUserArgumentResolver implements HandlerMethodArgumentResolver {
	
    private final AppSecurityComponent appSecurityComponent;

    @Override
    public uk.gov.etsgw.api.security.AppUser resolveArgument(MethodParameter methodParameter,
                                   ModelAndViewContainer modelViewContainer, NativeWebRequest nativeWebRequest,
                                   WebDataBinderFactory webDataBinderFactory) {
        return appSecurityComponent.getAuthenticatedUser();
    }

    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        return methodParameter.getParameterType().equals(AppUser.class);
    }
}
