package net.engineeringdigest.journalApp.Entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
	@Id
	private ObjectId id;
	@NonNull
	private String username;
	@NonNull
	private String password;
	@NonNull
	private List<Vehicle> vehicles;
	private String phoneNo;
	@NonNull
	private String email;
	private List<String> roles;
	private String OTP;
	private Instant otpExpiryTime;
	private int complaintsCount = 0;
	private List<Complains> history=new ArrayList<>();
}
