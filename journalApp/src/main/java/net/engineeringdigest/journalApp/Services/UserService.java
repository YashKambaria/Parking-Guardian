package net.engineeringdigest.journalApp.Services;


import com.twilio.rest.api.v2010.account.Call;
import com.twilio.rest.api.v2010.account.Message;
import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.Complains;
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
import java.time.Instant;
import java.util.*;


@Slf4j
@Service
public class UserService {
	
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
