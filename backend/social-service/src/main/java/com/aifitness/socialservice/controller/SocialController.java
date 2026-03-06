package com.aifitness.socialservice.controller;

import com.aifitness.socialservice.model.Post;
import com.aifitness.socialservice.model.Follower;
import com.aifitness.socialservice.model.ChatMessage;
import com.aifitness.socialservice.model.Comment;
import com.aifitness.socialservice.repository.PostRepository;
import com.aifitness.socialservice.repository.ChatRepository;
import com.aifitness.socialservice.repository.CommentRepository;
import com.aifitness.socialservice.repository.FollowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/social")
@CrossOrigin(origins = "*")
public class SocialController {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private ChatRepository chatRepository;
    
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private FollowerRepository followerRepository;

    @GetMapping("/feed")
    public List<Post> getFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/post")
    public Post createPost(@RequestBody Post post) {
        return postRepository.save(post);
    }

    @PostMapping("/chat")
    public ChatMessage sendMessage(@RequestBody ChatMessage message) {
        return chatRepository.save(message);
    }

    @GetMapping("/chat")
    public List<ChatMessage> getChat(@RequestParam UUID senderId, @RequestParam UUID receiverId) {
        return chatRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestampAsc(
                senderId, receiverId, senderId, receiverId);
    }

    @PostMapping("/comment")
    public Comment addComment(@RequestBody Comment comment) {
        System.out.println("Adding comment for post: " + comment.getPostId());
        return commentRepository.save(comment);
    }

    @GetMapping("/comments/{postId}")
    public List<Comment> getComments(@PathVariable UUID postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    // Follow Protocol
    @PostMapping("/follow")
    public ResponseEntity<?> follow(@RequestBody Map<String, UUID> req) {
        UUID followerId = req.get("followerId");
        UUID followingId = req.get("followingId");
        if (followerRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            return ResponseEntity.badRequest().body("Already following");
        }
        Follower f = new Follower(followerId, followingId);
        return ResponseEntity.ok(followerRepository.save(f));
    }

    @PostMapping("/unfollow")
    public ResponseEntity<?> unfollow(@RequestBody Map<String, UUID> req) {
        UUID followerId = req.get("followerId");
        UUID followingId = req.get("followingId");
        followerRepository.findByFollowerIdAndFollowingId(followerId, followingId)
            .ifPresent(f -> followerRepository.delete(f));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/is-following")
    public ResponseEntity<Boolean> isFollowing(@RequestParam UUID followerId, @RequestParam UUID followingId) {
        return ResponseEntity.ok(followerRepository.existsByFollowerIdAndFollowingId(followerId, followingId));
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Long>> getSocialStats(@PathVariable UUID userId) {
        return ResponseEntity.ok(Map.of(
            "followers", followerRepository.countByFollowingId(userId),
            "following", followerRepository.countByFollowerId(userId)
        ));
    }
}
