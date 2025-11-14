package uk.gov.etsgw.api.user.mapper;

import org.mapstruct.Mapper;

import uk.gov.etsgw.api.security.AppUser;
import uk.gov.etsgw.api.user.domain.UserDTO;

@Mapper(componentModel = "spring")
public interface UserMapper {

	UserDTO toUserDTO(AppUser appUser);

}
