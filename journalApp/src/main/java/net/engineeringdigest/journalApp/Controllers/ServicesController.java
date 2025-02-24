package net.engineeringdigest.journalApp.Controllers;

import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.ParkingIssueRequest;
import net.engineeringdigest.journalApp.Entities.UserEntity;
import net.engineeringdigest.journalApp.Repositories.UserRepository;
import net.engineeringdigest.journalApp.Services.EmailService;
import net.engineeringdigest.journalApp.Services.OtpService;
import net.engineeringdigest.journalApp.Services.PhoneService;
import net.engineeringdigest.journalApp.Services.UserService;
import net.engineeringdigest.journalApp.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
					emailService.sendAlert(vehicleOwner, request);
				}
				
				String s = phoneService.sendSMS(request, fromUsername);
				return new ResponseEntity<>(s, HttpStatus.OK);
			} else {
				return ResponseEntity.badRequest().body("User not found!");
			}
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error processing request");
		}
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
				phoneService.makeCall(FromUsername,request);
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
}
