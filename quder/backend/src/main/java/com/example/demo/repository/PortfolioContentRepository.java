package com.example.demo.repository;

import com.example.demo.model.PortfolioContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PortfolioContentRepository extends JpaRepository<PortfolioContent, Long> {
    Optional<PortfolioContent> findByLocale(String locale);
}
