package net.engineeringdigest.journalApp.Controllers;


import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.OtpValidate;
import net.engineeringdigest.journalApp.Entities.ParkingIssueRequest;
import net.engineeringdigest.journalApp.Entities.UserEntity;
import net.engineeringdigest.journalApp.Entities.Vehicle;
import net.engineeringdigest.journalApp.Repositories.UserRepository;
import net.engineeringdigest.journalApp.Services.EmailService;
import net.engineeringdigest.journalApp.Services.UserService;
import net.engineeringdigest.journalApp.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {
	
	
	@Autowired
	public UserService userService;
	
	@Autowired
	public UserRepository userRepository;
	
	@Autowired
	public EmailService emailService;
	
	@Autowired
	public JwtUtil jwtUtil;
	
	
	//this is used when the user will do the complain due to traffic
	@GetMapping("/sendSMS")
	public ResponseEntity<?> sendMessage(@RequestBody ParkingIssueRequest request){
		try {
			Optional<UserEntity> user = userRepository.findByPlateNo(request.getPlateNo());
			if (user.isPresent()) {
				UserEntity vehicleOwner = user.get();
				
				// Increment complaint count
				vehicleOwner.setComplaintsCount(vehicleOwner.getComplaintsCount() + 1);
				userRepository.save(vehicleOwner);
				
				// Send alert email if complaints reach 5
				if (vehicleOwner.getComplaintsCount() >= 5) {
					emailService.sendAlert(vehicleOwner,request);
				}
				
				
				String s = userService.sendSMS(request);
				return new ResponseEntity<>(s,HttpStatus.OK);
			}
			else{
				return ResponseEntity.badRequest().body("User not found!");
			}
		}
		catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	@GetMapping("/sendOTP")
	public ResponseEntity<?> generateOTP(){
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String username = authentication.getName();
			UserEntity user = userRepository.findByUsername(username);
			if (user != null) {
				String generatedOTP = userService.generateOTP();
				Instant expiry = Instant.now().plus(1, ChronoUnit.MINUTES);
				user.setOtpExpiryTime(expiry);
				user.setOTP(generatedOTP);
				userRepository.save(user);
				emailService.sendOTP(user, generatedOTP);
				return new ResponseEntity<>("OTP sent", HttpStatus.OK);
			}
			else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		}
		catch (Exception e){
			log.error("error while generating otp",e);
			return new ResponseEntity<>("Error while Generating OTP",HttpStatus.BAD_REQUEST);
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
					userRepository.save(user);
					return new ResponseEntity<>("Email verified succesfully ", HttpStatus.ACCEPTED);
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
	
	
	
	@GetMapping("/UrgentCall")
	public ResponseEntity<?> callUser(@RequestBody Vehicle user){
		try {
			String plateNo = user.getPlateNo();
			if (plateNo != null) {
				UserEntity vehicleOwner = userService.findUserByPlateNo(plateNo);
				// Increment complaint count
				vehicleOwner.setComplaintsCount(vehicleOwner.getComplaintsCount() + 1);
				userRepository.save(vehicleOwner);
				
				// Send alert email if complaints reach 5
				if (vehicleOwner.getComplaintsCount() >= 5) {
					emailService.sendAlert(vehicleOwner, plateNo);
				}
				UserEntity found = userService.findUserByPlateNo(plateNo);
				userService.makeCall(found.getPhoneNo(), plateNo);
				return new ResponseEntity<>("Calling user successfully ", HttpStatus.FOUND);
			} else {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
		catch (Exception e){
			log.error("Error while calling ",e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
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
