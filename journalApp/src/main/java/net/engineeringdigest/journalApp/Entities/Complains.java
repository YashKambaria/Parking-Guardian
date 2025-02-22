package net.engineeringdigest.journalApp.Entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Complains {
	private String From;
	private String plateNo;
	private String carModel;
	private Instant timestamp;
	private String type;
	private String location;
}
