package net.engineeringdigest.journalApp.Services;


import com.twilio.rest.api.v2010.account.Call;
import com.twilio.rest.api.v2010.account.Message;
import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.ParkingIssueRequest;
import net.engineeringdigest.journalApp.Entities.UserEntity;
import net.engineeringdigest.journalApp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.twilio.Twilio;
import com.twilio.type.PhoneNumber;
import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;


@Slf4j
@Service
public class UserService {
	
	@Value("${Twilio.SID}")
	private String SID_ACCOUNT;
	@Value("${Twilio.ID}")
	private String AUTH_ID;
	@Value("${Twilio.NUMBER}")
	private String FROM_NUMBER;
	
	@Autowired
	public UserRepository userRepository;
	
	@Autowired
	public PasswordEncoder passwordEncoder;
	
	public boolean saveUser(UserEntity userEntity) {
		try{
			userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
			userEntity.setRoles(Arrays.asList("User"));
			userRepository.save(userEntity);
			return true;
		}
		catch (Exception e){
			log.error("error while saving user",e);
			return false;
		}
		
	}
	
	//for updating the user details
	public void saveEntry(UserEntity user){
		userRepository.save(user);
	}
	
	public List<UserEntity> getAll() {
			List<UserEntity> all = userRepository.findAll();
			return all;
	}
	
	public UserEntity findUserByPlateNo(String plateNo) {
		Optional<UserEntity> byPlateNo = userRepository.findByPlateNo(plateNo);
		return byPlateNo.get();
	}
	
	@PostConstruct
	public void setup(){
		Twilio.init(SID_ACCOUNT,AUTH_ID);
	}
	public String sendSMS(ParkingIssueRequest request) {
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
		
		String message = "Your " + carModel + "(Plate: " + request.getPlateNo() + ") is blocking a spot. Please move it! Location: " + googleMapsLink;
		
		Message.creator(
				new PhoneNumber(phoneNo),
				new PhoneNumber(FROM_NUMBER),
				message).create();
		
		return "Message Sent successfully";
		
	}
	public void makeCall(String userPhoneNumber, String plateNo) {
		try {
			String carModel = userRepository.findByPlateNo(plateNo)
					.map(user -> user.getVehicles().stream()
							.filter(vehicle -> vehicle.getPlateNo().equals(plateNo))
							.map(vehicle -> vehicle.getCarModel())
							.findFirst()
							.orElse(null)) // Handle case where no vehicle is found
					.orElse(null);
			Call.creator(
					new PhoneNumber(userPhoneNumber),
					new PhoneNumber(FROM_NUMBER),
					new com.twilio.type.Twiml("<Response><Say>Your" + carModel+ " is blocking a vehicle. Please move it.\"!</Say></Response>")
			).create();
		}
		catch (Exception e){
			log.error("CALLING EXCEPTION ______________------------",e);
		}
	}
	
	// Validate user details before saving
	public String validateUser(UserEntity user) {
		if (userRepository.existsByUsername(user.getUsername())) {
			return "Username is already taken!";
		}
		if (userRepository.existsByEmail(user.getEmail())) {
			return "Email is already registered!";
		}
		if (userRepository.existsByPhoneNo(user.getPhoneNo())) {
			return "Phone number is already registered!";
		}
		return null;
	}
	
	public void deleteByUserName(String name) {
		userRepository.deleteByUsername(name);
	}
	
	
}
