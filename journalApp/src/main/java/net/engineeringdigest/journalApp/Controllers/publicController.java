package net.engineeringdigest.journalApp.controllers;

import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.UserEntity;
import net.engineeringdigest.journalApp.repositories.UserRepository;
import net.engineeringdigest.journalApp.services.UserDetailServiceImpl;
import net.engineeringdigest.journalApp.services.UserService;
import net.engineeringdigest.journalApp.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/public")
public class PublicController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private UserDetailServiceImpl userDetailsService;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private UserRepository userRepository;
	
	@PostMapping("/sign-up")
	public ResponseEntity<?> signup(@RequestBody UserEntity user){
		String validationMessage = userService.validateUser(user);
		if (validationMessage != null) {
			return ResponseEntity.badRequest().body(Collections.singletonMap("error", validationMessage));
		}
		boolean b = userService.saveUser(user);
		if(b){
			return new ResponseEntity<>(HttpStatus.CREATED);
		}
		
		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	}
	
	@PostMapping("/login")
	public  ResponseEntity<String> login(@RequestBody UserEntity user) {
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
			UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
			String jwt=jwtUtil.generateToken(userDetails.getUsername());
			return new ResponseEntity<>(jwt, HttpStatus.OK);
		} catch (Exception e) {
			log.error("Exception occur while create AuthentcationToken ",e);
			return new ResponseEntity<>("Incorrect username or password",HttpStatus.BAD_REQUEST);
		}
	}
	@PostMapping("/refresh-token")
	public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
		String username = request.get("username");
		UserEntity user= userRepository.findByUsername(username);
		UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
		String jwt=jwtUtil.generateToken(userDetails.getUsername());
		return ResponseEntity.ok(jwt);
	}
}

