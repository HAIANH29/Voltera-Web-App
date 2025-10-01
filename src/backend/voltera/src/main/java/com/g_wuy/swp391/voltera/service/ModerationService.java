
package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Post;
import com.g_wuy.swp391.voltera.entity.Post.PostStatus;
import com.g_wuy.swp391.voltera.model.request.ModerationRequest;
import com.g_wuy.swp391.voltera.model.response.ModerationResponse;
import com.g_wuy.swp391.voltera.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ModerationService {
    @Autowired
    private PostRepository postRepository;

    public List<Post> getPendingPosts() {
        return postRepository.findByStatus(Post.PostStatus.PENDING);
    }

    public ModerationResponse approvePost(ModerationRequest request) {
        Optional<Post> postOptional = postRepository.findById(request.getPostId());
        if (postOptional.isEmpty()) {
            throw new IllegalArgumentException("Post not found");
        }

        Post post = postOptional.get();
        PostStatus newStatus = PostStatus.APPROVE.equals(request.getStatus()) ? PostStatus.APPROVE : PostStatus.REJECT;
        postRepository.updateStatusById(post.getId(), newStatus);
        if (request.getReason() != null) {
            post.setDescription(post.getDescription() + "\n[Admin Note: " + request.getReason() + "]");
            postRepository.save(post);
        }

        return new ModerationResponse(post.getId(), newStatus, request.getReason());
    }

    public ModerationResponse rejectPost(Integer postId, String reason) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty()) {
            throw new IllegalArgumentException("Post not found");
        }

        Post post = postOptional.get();
        postRepository.updateStatusById(post.getId(), PostStatus.REJECT);
        if (reason != null) {
            post.setDescription(post.getDescription() + "\n[Reject Note: " + reason + "]");
            postRepository.save(post); // Cập nhật description
        }

        return new ModerationResponse(post.getId(), PostStatus.REJECT, reason);
    }

    public void setInitialStatus(Post post) {
        // Trạng thái mặc định đã được set trong entity, không cần làm gì thêm
    }
}