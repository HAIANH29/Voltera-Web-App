package com.g_wuy.swp391.voltera.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g_wuy.swp391.voltera.entity.FavoriteList;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.exception.BusinessException;
import com.g_wuy.swp391.voltera.mapper.FavListMapper;
import com.g_wuy.swp391.voltera.model.response.FavListResponse;
import com.g_wuy.swp391.voltera.service.FavoriteService;
import com.g_wuy.swp391.voltera.service.JwtService;
import com.g_wuy.swp391.voltera.service.UserService;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteListController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private FavListMapper favListMapper;

    @PostMapping("/add/{postID}")
    public ResponseEntity<FavoriteList> addToList(
        @RequestHeader("Authorization") String authHeader, 
        @PathVariable("postID") Integer postId) {
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        User userAdd = null;
        if (username != null) {
            userAdd = userService.findUserByUsername(username);
        }
        return ResponseEntity.ok(favoriteService.addToFavoriteList(userAdd, postId));
    }

    @DeleteMapping("/delete/{postID}")
    public ResponseEntity<String> removeFromList(
        @PathVariable("postID") Integer postID, 
        @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        User user = userService.findUserByUsername(username);
        if (user == null) {
            throw new BusinessException("User Not found");
        }
        favoriteService.removeFromFavList(user.getId(), postID);
        return ResponseEntity.ok("Removed from favorite list");
    }

    @GetMapping
    public ResponseEntity<List<FavListResponse>> getFavorites(
        @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        User user = userService.findUserByUsername(username);
        if (user == null) {
            throw new BusinessException("User Not found");
        }
        List<FavoriteList> favoriteLists = favoriteService.getFavoritelistsByUserID(user.getId());
        return ResponseEntity.ok(favListMapper.toDtoList(favoriteLists));
    }
}