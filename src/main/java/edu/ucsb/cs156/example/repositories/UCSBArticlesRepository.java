package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.UCSBArticles;

import org.springframework.beans.propertyeditors.StringArrayPropertyEditor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UCSBArticlesRepository extends CrudRepository<UCSBArticles, Long> {
 
}
