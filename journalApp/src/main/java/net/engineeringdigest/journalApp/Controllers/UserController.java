package net.engineeringdigest.journalApp.Controllers;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.*;
import net.engineeringdigest.journalApp.Repositories.UserRepository;
import net.engineeringdigest.journalApp.Services.EmailService;
import net.engineeringdigest.journalApp.Services.OtpService;
import net.engineeringdigest.journalApp.Services.PhoneService;
import net.engineeringdigest.journalApp.Services.UserService;
import net.engineeringdigest.journalApp.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
	
	@Autowired
	public UserService userService;
	
	@Autowired
	public UserRepository userRepository;
	
	@Autowired
	public EmailService emailService;
	
	@Autowired
	public JwtUtil jwtUtil;
	
	@Autowired
	public OtpService otpService;
	
	@Autowired
	public PhoneService phoneService;
	
	//USER Verification started
	@GetMapping("/sendOTPEmail")
	public ResponseEntity<?> generateOTP(){
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String username = authentication.getName();
			UserEntity user = userRepository.findByUsername(username);
			if (user != null) {
				boolean otpSend = otpService.EmailOTP(user);
				if (otpSend) {
					return new ResponseEntity<>("OTP sent", HttpStatus.OK);
				}
				else{
					return new ResponseEntity<>("Error while Generating OTP ",HttpStatus.BAD_REQUEST);
				}
			}
			else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		}
		catch (Exception e){
			log.error("error while generating otp",e);
			return new ResponseEntity<>("Something went wrong please try again ",HttpStatus.BAD_REQUEST);
		}
	}
	@GetMapping("/sendOTPPhone")
	public ResponseEntity<?> generateOTPPhone(){
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String username = authentication.getName();
			UserEntity user = userRepository.findByUsername(username);
			if (user != null) {
				boolean otpSend = otpService.PhoneOTP(user);
				if (otpSend) {
					return new ResponseEntity<>("OTP sent", HttpStatus.OK);
				}
				else{
					return new ResponseEntity<>("Error while Generating OTP ",HttpStatus.BAD_REQUEST);
				}
			}
			else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		}
		catch (Exception e){
			log.error("error while generating otp",e);
			return new ResponseEntity<>("Something went wrong please try again ",HttpStatus.BAD_REQUEST);
		}
	}
	
	
	@PostMapping("/verifyEmail")
	public ResponseEntity<?> verifyEmail(@RequestBody OtpValidate otpValidate){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		UserEntity user = userRepository.findByUsername(username);
		
		if (user != null && otpValidate.getOtp()!= null) {
			Instant now = Instant.now();
			if(user.getOTP().equals(otpValidate.getOtp())){
				if (now.isBefore(user.getOtpExpiryTime())) {
					user.setOTP(null);
					user.setEmailVerified(true);
					userRepository.save(user);
					return new ResponseEntity<>("Email verified successfully ", HttpStatus.ACCEPTED);
				}
				else {
					return new ResponseEntity<>("OTP is expired please Regenerate it",HttpStatus.EXPECTATION_FAILED);
				}
			}
			else {
				return new ResponseEntity<>("Invalid OTP ", HttpStatus.BAD_REQUEST);
			}
		}
		else {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/verifyPhone")
	public ResponseEntity<?> verifyPhone(@RequestBody OtpValidate otpValidate){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		UserEntity user = userRepository.findByUsername(username);
		
		if (user != null && otpValidate.getOtp()!= null && user.getOTP()!=null) {
			Instant now = Instant.now();
			if(user.getOTP().equals(otpValidate.getOtp())){
				if (now.isBefore(user.getOtpExpiryTime())) {
					user.setOTP(null);
					user.setPhoneVerified(true);
					userRepository.save(user);
					return new ResponseEntity<>("Phone Number verified succesfully ", HttpStatus.ACCEPTED);
				}
				else {
					return new ResponseEntity<>("OTP is expired please Regenerate it",HttpStatus.EXPECTATION_FAILED);
				}
			}
			else {
				return new ResponseEntity<>("Invalid OTP ", HttpStatus.BAD_REQUEST);
			}
		}
		else {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	//USER Verification ended
	
	//CRUD OPERATIOM FOR USER
	@GetMapping("/getUser")
	public ResponseEntity<?> getUser(){
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String name = authentication.getName();
			UserEntity user = userRepository.findByUsername(name);
			return new ResponseEntity<>(user, HttpStatus.OK);
		}
		catch (Exception e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/updateDetails")
	public ResponseEntity<?> updateUserDetails(@RequestBody UserEntity UpdateUser) {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String loggedInUsername = authentication.getName();
			
			UserEntity existingUser = userRepository.findByUsername(loggedInUsername);
			if (existingUser == null) {
				return new ResponseEntity<>("User Not Found", HttpStatus.NOT_FOUND);
			}
			
			userService.updateUser(UpdateUser, existingUser);
			
			return new ResponseEntity<>(existingUser, HttpStatus.OK);
		} catch (DataAccessException e) {
			return new ResponseEntity<>("Database Error: Unable to update user", HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (Exception e) {
			return new ResponseEntity<>("Error while updating User. Please Try Again Later", HttpStatus.BAD_REQUEST);
		}
	}
	
	@DeleteMapping("/deleteUser")
	public ResponseEntity<?> deleteUser(){
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			if (userRepository.findByUsername(authentication.getName())!=null) {
				userService.deleteByUserName(authentication.getName());
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		}
		catch (Exception e){
			log.error("User not found ",e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	
}
