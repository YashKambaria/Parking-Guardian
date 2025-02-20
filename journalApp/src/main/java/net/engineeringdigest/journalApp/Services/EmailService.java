package net.engineeringdigest.journalApp.Services;

import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.ParkingIssueRequest;
import net.engineeringdigest.journalApp.Entities.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {
	
	
	@Autowired
	private JavaMailSender javaMailSender;
	
	public void sendEmail(String to,String subject,String body){
		try{
			SimpleMailMessage mail=new SimpleMailMessage();
			mail.setTo(to);
			mail.setSubject(subject);
			mail.setText(body);
			javaMailSender.send(mail);
			
		}
		catch (Exception e){
			log.error("Exception while sendEmail",e);
		}
	}
	
	public void sendAlert(UserEntity vehicleOwner, ParkingIssueRequest request) {
		String subject = "⚠️ Parking Violation Alert!";
		String message = "Dear " + vehicleOwner.getUsername() + ",\n\n" +
				"Your vehicle (Plate: " + request.getPlateNo() + ") has received "+vehicleOwner.getComplaintsCount()+" complaints for improper parking. " +
				"Please ensure you follow parking rules to avoid further action.\n\n" +
				"Thank you.";
		sendEmail(vehicleOwner.getEmail(), subject, message);
	}
	public void sendAlert(UserEntity vehicleOwner, String request) {
		String subject = "⚠️ Parking Violation Alert!";
		String message = "Dear " + vehicleOwner.getUsername() + ",\n\n" +
				"Your vehicle (Plate: " + request + ") has received "+vehicleOwner.getComplaintsCount()+" complaints for improper parking. " +
				"Please ensure you follow parking rules to avoid further action.\n\n" +
				"Thank you.";
		sendEmail(vehicleOwner.getEmail(), subject, message);
	}
	public void sendOTP(UserEntity vehicleOwner,String OTP){
		String subject = "Your OTP Verification Code for Secure Login";
		String message = "Dear User,\n\n"
				+ "We received a request to verify your email for secure login. Please use the following One-Time Password (OTP) to complete the verification process:\n\n"
				+ "🔐 Your OTP Code: "+ OTP
				+"\n\nThis OTP is valid for 10 minutes. Do not share it with anyone for security reasons.\n\n"
				+ "If you didn’t request this, you can safely ignore this email.\n\n"
				+ "Best regards,\n"
				+ "🚀 Parking Guardian Team\n"
				+ "📩 Support: support@email.com";
		sendEmail(vehicleOwner.getEmail(), subject,message);
	}
	
}
