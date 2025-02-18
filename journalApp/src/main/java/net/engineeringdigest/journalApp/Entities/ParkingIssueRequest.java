package net.engineeringdigest.journalApp.Entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParkingIssueRequest {
	private String plateNo;
	private double latitude;
	private double longitude;
}
