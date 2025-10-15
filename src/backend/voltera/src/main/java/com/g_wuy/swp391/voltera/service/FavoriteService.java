package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.FavoriteList;
import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.exception.BusinessException;
import com.g_wuy.swp391.voltera.repository.FavoriteListRepository;
import com.g_wuy.swp391.voltera.repository.PostRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteListRepository favoriteListRepository;

    @Autowired
    private PostRepository postRepository;

    public FavoriteList addToFavoriteList(User currentUser, Integer postID) {
        if (currentUser == null) {
            throw new  BusinessException("User not found");
        }

        if (favoriteListRepository.existsByUseridAndPostid(currentUser.getId(), postID)) {
            throw new BusinessException("This post already in favorite list");
        }
        Post favPost = postRepository.findPostById(postID);
        if (favPost == null) {
           throw new BusinessException("Post not found");
        }
        FavoriteList favList = FavoriteList.builder().userid(currentUser).postid(favPost).build();
        return favoriteListRepository.save(favList);
    }

    public void removeFromFavList(Integer userID, Integer postID) {
        FavoriteList favoritelist = favoriteListRepository.findByUseridAndPostid(userID, postID);
        if (favoritelist == null) {
            throw new BusinessException("Post not found");
        }
        favoriteListRepository.delete(favoritelist);
    }

    public List<FavoriteList> getFavoritelistsByUserID(Integer userID) {
        if (userID == null) {
            throw new BusinessException("User not found");
        }
        List<FavoriteList> favoriteLists = favoriteListRepository.findByUserid(userID);
        return favoriteLists;
    }
}
