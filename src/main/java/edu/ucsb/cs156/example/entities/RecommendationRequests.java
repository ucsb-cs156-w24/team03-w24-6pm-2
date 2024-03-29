package edu.ucsb.cs156.example.entities;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "recommendationrequests")
public class RecommendationRequests  {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String requesterEmail;
  private String professorEmail;
  private String Explanation;
  private LocalDateTime dateRequested;
  private LocalDateTime dateNeeded;
  boolean done;

}
