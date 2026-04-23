package com.example.demo.controller;

import com.example.demo.model.PortfolioContent;
import com.example.demo.service.PortfolioContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "*")
public class PortfolioController {
    
    @Autowired
    private PortfolioContentService contentService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    // Get all locales content
    @GetMapping("/content")
    public List<PortfolioContent> getAllContent() {
        return contentService.getAllContent();
    }
    
    // Get content by locale
    @GetMapping("/content/{locale}")
    public Optional<PortfolioContent> getContent(@PathVariable String locale) {
        return contentService.getContentByLocale(locale);
    }
    
    // Save/Update content
    @PostMapping("/content")
    public PortfolioContent saveContent(@RequestBody SaveRequest request) {
        PortfolioContent saved = contentService.saveContent(request.getLocale(), request.getContent());
        
        // Broadcast update via WebSocket
        messagingTemplate.convertAndSend("/topic/content/" + request.getLocale(), saved);
        
        return saved;
    }
    
    // Delete content
    @DeleteMapping("/content/{locale}")
    public void deleteContent(@PathVariable String locale) {
        contentService.deleteContent(locale);
    }
    
    // Health check
    @GetMapping("/health")
    public String health() {
        return "ok";
    }
    
    public static class SaveRequest {
        private String locale;
        private String content;
        
        public String getLocale() { return locale; }
        public void setLocale(String locale) { this.locale = locale; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
