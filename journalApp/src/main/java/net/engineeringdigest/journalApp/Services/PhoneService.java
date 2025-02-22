package net.engineeringdigest.journalApp.Services;


import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Call;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.Complains;
import net.engineeringdigest.journalApp.Entities.ParkingIssueRequest;
import net.engineeringdigest.journalApp.Entities.UserEntity;
import net.engineeringdigest.journalApp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PhoneService {
	
	@Autowired
	public UserRepository userRepository;
	
	@Value("${Twilio.SID}")
	private String SID_ACCOUNT;
	@Value("${Twilio.ID}")
	private String AUTH_ID;
	@Value("${Twilio.NUMBER}")
	private String FROM_NUMBER;
	
	@PostConstruct
	public void setup(){
		Twilio.init(SID_ACCOUNT,AUTH_ID);
	}
	public String sendSMS(ParkingIssueRequest request, String fromUsername) {
		Optional<UserEntity> user1 = userRepository.findByPlateNo(request.getPlateNo());
		String phoneNo = user1.get().getPhoneNo();
		String googleMapsLink = "https://www.google.com/maps?q=" + request.getLatitude() + "," + request.getLongitude();
		
		
		String carModel=userRepository.findByPlateNo(request.getPlateNo())
				.map(user -> user.getVehicles().stream()
						.filter(vehicle -> vehicle.getPlateNo().equals(request.getPlateNo()))
						.map(vehicle -> vehicle.getCarModel())
						.findFirst()
						.orElse(null)) // Handle case where no vehicle is found
				.orElse(null);  // Handle case where no user is found
		
		List<Complains> history = user1.get().getHistory();
		Instant instant=Instant.now();
		history.add(new Complains(fromUsername, request.getPlateNo(),carModel,instant,"SMS",googleMapsLink));
		userRepository.save(user1.get());
		String message = "Your " + carModel + "(Plate: " + request.getPlateNo() + ") is blocking a spot. Please move it! Location: " + googleMapsLink;
		
		Message.creator(
				new PhoneNumber(phoneNo),
				new PhoneNumber(FROM_NUMBER),
				message).create();
		
		return "Message Sent successfully";
		
	}
	public void makeCall(String FromUsername, ParkingIssueRequest request) {
		try {
			String googleMapsLink = "https://www.google.com/maps?q=" + request.getLatitude() + "," + request.getLongitude();
			UserEntity user1 = userRepository.findByPlateNo(request.getPlateNo()).get();
			List<Complains> history = user1.getHistory();
			Instant instant=Instant.now();
			String carModel = userRepository.findByPlateNo(request.getPlateNo())
					.map(user -> user.getVehicles().stream()
							.filter(vehicle -> vehicle.getPlateNo().equals(request.getPlateNo()))
							.map(vehicle -> vehicle.getCarModel())
							.findFirst()
							.orElse(null)) // Handle case where no vehicle is found
					.orElse(null);
			history.add(new Complains(FromUsername,request.getPlateNo(),carModel,instant,"Call",googleMapsLink));
			userRepository.save(user1);
			Call.creator(
					new PhoneNumber(user1.getPhoneNo()),
					new PhoneNumber(FROM_NUMBER),
					new com.twilio.type.Twiml("<Response><Say>Your" + carModel+ " is blocking a vehicle. Please move it.\"!</Say></Response>")
			).create();
		}
		catch (Exception e){
			log.error("CALLING EXCEPTION ______________------------",e);
		}
	}
	
	public void sendOTP(UserEntity user, String generatedOTP) {
		try {
			String message = "Your OTP Verification Code for Secure Login"
					+ "Dear " + user.getUsername() + ",\n\n"
					+ "We received a request to verify your email for secure login. Please use the following One-Time Password (OTP) to complete the verification process:\n\n"
					+ "🔐 Your OTP Code: " + generatedOTP
					+ "\n\nThis OTP is valid for 10 minutes. Do not share it with anyone for security reasons.\n\n"
					+ "If you didn’t request this, you can safely ignore this email.\n\n"
					+ "Best regards,\n"
					+ "🚀 Parking Guardian Team\n"
					+ "📩 Support: support@email.com";
			Message.creator(
					new PhoneNumber(user.getPhoneNo()),
					new PhoneNumber(FROM_NUMBER),
					message).create();
		}
		catch (Exception e){
			log.error("Error while sending otp ",e);
		}
	}
}
