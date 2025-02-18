package net.engineeringdigest.journalApp.Repositories;



import net.engineeringdigest.journalApp.Entities.UserEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface UserRepository extends MongoRepository<UserEntity, ObjectId>{
	UserEntity findUserByPhoneNo(String phoneNo);
	@Query("{ 'vehicles.plateNo': ?0 }")
	Optional<UserEntity> findByPlateNo(String plateNo);
	UserEntity findUserByEmail(String email);
	UserEntity findByUsername(String username);
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
	boolean existsByPhoneNo(String phoneNo);
	void deleteByUsername(String username);
	
}
