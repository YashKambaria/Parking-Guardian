package net.engineeringdigest.journalApp.Services;

import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.UserEntity;
import net.engineeringdigest.journalApp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Service
@Slf4j
public class OtpService {
	@Autowired
	public UserRepository userRepository;
	@Autowired
	public EmailService emailService;
	@Autowired
	public PhoneService phoneService;
	
	public String generateOTP(){
		Random random=new Random();
		int otpvalue=100000+random.nextInt(900000);
		return String.valueOf(otpvalue);
	}
	public boolean EmailOTP(UserEntity user){
		try {
			String generatedOTP = generateOTP();
			Instant expiry = Instant.now().plus(5, ChronoUnit.MINUTES);
			user.setOtpExpiryTime(expiry);
			user.setOTP(generatedOTP);
			userRepository.save(user);
			emailService.sendOTP(user, generatedOTP);
			return true;
		}
		catch (Exception e) {
			log.error("error while sending otp via Mail ",e);
			return false;
		}
	}
	
	public boolean PhoneOTP(UserEntity user) {
		try {
			String generatedOTP = generateOTP();
			Instant expiry = Instant.now().plus(5, ChronoUnit.MINUTES);
			user.setOtpExpiryTime(expiry);
			user.setOTP(generatedOTP);
			userRepository.save(user);
			phoneService.sendOTP(user, generatedOTP);
			return true;
		}
		catch (Exception e){
			return false;
		}
		
	}
}
