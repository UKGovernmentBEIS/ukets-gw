package uk.gov.etsgw.api.user.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import uk.gov.etsgw.api.security.AppUser;
import uk.gov.etsgw.api.user.domain.UserDTO;

class UserMapperTest {

	private UserMapper userMapper = Mappers.getMapper(UserMapper.class);

	@Test
	void toUserDTO() {
		String fName = "fName";
		String lName = "lName";

		AppUser appUser = new AppUser();
		appUser.setFirstName(fName);
		appUser.setLastName(lName);

		UserDTO result = userMapper.toUserDTO(appUser);

		assertThat(result).isEqualTo(UserDTO.builder().firstName(fName).lastName(lName).build());
	}

}