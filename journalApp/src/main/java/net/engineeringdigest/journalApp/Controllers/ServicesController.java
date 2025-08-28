package net.engineeringdigest.journalApp.controllers;

import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.ParkingIssueRequest;
import net.engineeringdigest.journalApp.Entities.UserEntity;
import net.engineeringdigest.journalApp.repositories.UserRepository;
import net.engineeringdigest.journalApp.services.*;
import net.engineeringdigest.journalApp.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/userServices")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class ServicesController {
	
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
	
	@Autowired
	public NotificationService notificationService;
	//this is used when the user will do the complain due to traffic
	@PostMapping("/sendSMS")
	public ResponseEntity<?> sendMessage(@RequestBody ParkingIssueRequest request) {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String fromUsername = authentication.getName();
			Optional<UserEntity> user = userRepository.findByPlateNo(request.getPlateNo());
			
			if (user.isPresent()) {
				UserEntity vehicleOwner = user.get();
				vehicleOwner.setComplaintsCount(vehicleOwner.getComplaintsCount() + 1);
				userRepository.save(vehicleOwner);
				
				
				
				if (vehicleOwner.getComplaintsCount() >= 5) {
					notificationService.sendMail(vehicleOwner,request);
				}
				try{
				   notificationService.sendAlert(fromUsername,request);
				return new ResponseEntity<>("Message Sent Successfully", HttpStatus.OK);
				}
				catch (Exception e){
				log.error("Error while SMS--------------------------------->",e);
				return new ResponseEntity<>("Error Occured while Sending SMS to user",HttpStatus.BAD_REQUEST);
			}
			} else {
				return ResponseEntity.badRequest().body("User not found!");
			}
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error processing request");
		}
	}
	
	@Async
	public void sendMail(UserEntity vehicleOwner,ParkingIssueRequest request){
		emailService.sendAlert(vehicleOwner, request);
	}
	@Async
	public void sendAlert(String fromUsername,ParkingIssueRequest request){
		phoneService.sendSMS(request, fromUsername);
	}
	
	@PostMapping("/UrgentCall")
	public ResponseEntity<?> callUser(@RequestBody ParkingIssueRequest request){
		try {
			String plateNo = request.getPlateNo();
			if (plateNo != null) {
				Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
				String FromUsername=authentication.getName();
				UserEntity vehicleOwner = userService.findUserByPlateNo(plateNo);
				// Increment complaint count
				vehicleOwner.setComplaintsCount(vehicleOwner.getComplaintsCount() + 1);
				userRepository.save(vehicleOwner);
				
				// Send alert email if complaints reach 5
				if (vehicleOwner.getComplaintsCount() >= 5) {
					emailService.sendAlert(vehicleOwner, plateNo);
				}
				try {
					phoneService.makeCall(FromUsername, request);
					return new ResponseEntity<>("Calling user successfully ", HttpStatus.OK);
				}
				catch (Exception e){
					log.error("Error while calling--------------------------------->",e);
					return new ResponseEntity<>("Error Occured while calling user",HttpStatus.BAD_REQUEST);
				}
			} else {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
		catch (Exception e){
			log.error("Error while calling ",e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
}
