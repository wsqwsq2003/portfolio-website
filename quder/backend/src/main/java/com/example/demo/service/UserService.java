package com.example.demo.service;

import com.example.demo.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class UserService {
    
    private final List<User> users = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);
    
    public UserService() {
        // 初始化一些示例数据
        users.add(new User(idCounter.getAndIncrement(), "张三", "zhangsan@example.com"));
        users.add(new User(idCounter.getAndIncrement(), "李四", "lisi@example.com"));
        users.add(new User(idCounter.getAndIncrement(), "王五", "wangwu@example.com"));
    }
    
    public List<User> getAllUsers() {
        return new ArrayList<>(users);
    }
    
    public User addUser(User user) {
        user.setId(idCounter.getAndIncrement());
        users.add(user);
        return user;
    }
}
