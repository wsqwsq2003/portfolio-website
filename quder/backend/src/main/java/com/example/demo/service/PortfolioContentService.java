package com.example.demo.service;

import com.example.demo.model.PortfolioContent;
import com.example.demo.repository.PortfolioContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PortfolioContentService {
    
    @Autowired
    private PortfolioContentRepository repository;
    
    public List<PortfolioContent> getAllContent() {
        return repository.findAll();
    }
    
    public Optional<PortfolioContent> getContentByLocale(String locale) {
        return repository.findByLocale(locale);
    }
    
    public PortfolioContent saveContent(String locale, String content) {
        PortfolioContent portfolioContent = repository.findByLocale(locale)
                .orElse(new PortfolioContent());
        portfolioContent.setLocale(locale);
        portfolioContent.setContent(content);
        return repository.save(portfolioContent);
    }
    
    public void deleteContent(String locale) {
        repository.findByLocale(locale).ifPresent(repository::delete);
    }
}
