package net.engineeringdigest.journalApp.services;

import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.ParkingIssueRequest;
import net.engineeringdigest.journalApp.Entities.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private PhoneService phoneService;
	
	@Async
	public void sendMail(UserEntity vehicleOwner, ParkingIssueRequest request) {
		emailService.sendAlert(vehicleOwner, request);
	}
	
	@Async
	public void sendAlert(String fromUsername, ParkingIssueRequest request) {
		phoneService.sendSMS(request, fromUsername);
	}
	@Async
	public void makeCall(String fromUsername, ParkingIssueRequest request) {
		phoneService.makeCall(fromUsername,request);
	}
}
