package uk.gov.etsgw.api.web.controller.user;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import uk.gov.etsgw.api.security.AppSecurityComponent;
import uk.gov.etsgw.api.security.AppUser;
import uk.gov.etsgw.api.user.domain.UserDTO;
import uk.gov.etsgw.api.user.mapper.UserMapper;
import uk.gov.etsgw.api.web.config.AppUserArgumentResolver;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

	private static final String USER_CONTROLLER_PATH = "/v1.0/users";

	private MockMvc mockMvc;

	@InjectMocks
	private UserController userController;

	@Mock
	private AppSecurityComponent etsGwSecurityComponent;

	@Mock
	private UserMapper userMapper;

	@BeforeEach
	public void setUp() {
		mockMvc = MockMvcBuilders.standaloneSetup(userController)
				.setCustomArgumentResolvers(new AppUserArgumentResolver(etsGwSecurityComponent)).build();
	}

	@Test
	void getCurrentUser() throws Exception {
		final String userId = "userId";
		final String firstName = "firstName";
		final String lastName = "lastName";
		
		AppUser appUser = AppUser.builder().userId(userId).firstName(firstName).lastName(lastName).build();

		UserDTO userDTO = UserDTO.builder().firstName(firstName).lastName(lastName).build();

		when(etsGwSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
		when(userMapper.toUserDTO(appUser)).thenReturn(userDTO);

		mockMvc.perform(MockMvcRequestBuilders.get(USER_CONTROLLER_PATH).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.firstName").value(firstName))
				.andExpect(jsonPath("$.lastName").value(lastName));
	}

}