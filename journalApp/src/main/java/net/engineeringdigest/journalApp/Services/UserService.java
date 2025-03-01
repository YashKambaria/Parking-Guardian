package net.engineeringdigest.journalApp.Services;


import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Entities.UserEntity;
import net.engineeringdigest.journalApp.Entities.Vehicle;
import net.engineeringdigest.journalApp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
	
	
	public void updateUser(UserEntity updatedUser, UserEntity existingUser) {
		try{
				if(updatedUser.getUsername()!=null && !updatedUser.getUsername().equals(existingUser.getUsername())){
					existingUser.setUsername(updatedUser.getUsername());
				}
				if(updatedUser.getPhoneNo()!=null && !updatedUser.getPhoneNo().equals(existingUser.getPhoneNo())){
					existingUser.setPhoneNo(updatedUser.getPhoneNo());
					existingUser.setPhoneVerified(false);
				}
				if(updatedUser.getEmail()!=null && !updatedUser.getEmail().equals(existingUser.getEmail())){
					existingUser.setEmail(updatedUser.getEmail());
					existingUser.setEmailVerified(false);
				}
			if(updatedUser.getPassword()!=null && updatedUser.getPassword().equals(existingUser.getPassword())){
				existingUser.setPassword(updatedUser.getPassword());
				saveUser(existingUser); //as there will be new password and it should be encrypted
			}
			else{
				saveEntry(existingUser); //as the user has not updated the password
			}
		}
		catch (Exception e){
			log.error("error while updating user ---------------------->",e);
			throw e;
		}
	}
	
	public void addVehicle(UserEntity user, Vehicle vehicle) {
		List<Vehicle> vehicles = user.getVehicles();
		vehicles.add(vehicle);
		saveEntry(user);
	}
}
