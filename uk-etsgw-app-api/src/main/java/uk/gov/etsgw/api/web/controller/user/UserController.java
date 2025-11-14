package uk.gov.etsgw.api.web.controller.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import uk.gov.etsgw.api.security.AppUser;
import uk.gov.etsgw.api.user.domain.UserDTO;
import uk.gov.etsgw.api.user.mapper.UserMapper;

@RestController
@RequestMapping(path = "/v1.0/users")
@Tag(name = "Users")
@RequiredArgsConstructor
public class UserController {

	private final UserMapper userMapper;

	@GetMapping
	@Operation(summary = "Retrieves info of the logged in user")
	@ApiResponse(responseCode = "200", description = "OK", content = {
			@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = UserDTO.class)) })
	@ApiResponse(responseCode = "500", description = "Internal Server Error", content = {
			@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class)) })
	public ResponseEntity<UserDTO> getCurrentUser(@Parameter(hidden = true) AppUser appUser) {
		return new ResponseEntity<>(userMapper.toUserDTO(appUser), HttpStatus.OK);
	}

}
