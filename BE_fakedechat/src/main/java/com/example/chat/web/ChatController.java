package com.example.chat.web;

import com.example.chat.dto.ConversationSummary;
import com.example.chat.dto.SendMessageRequest;
import com.example.chat.model.ChatMessage;
import com.example.chat.service.ChatStore;
import jakarta.validation.Valid;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
public class ChatController {

  private final ChatStore store;
  private final SimpMessagingTemplate template;

  public ChatController(ChatStore store, SimpMessagingTemplate template) {
    this.store = store;
    this.template = template;
  }

  @MessageMapping("/chat/{userId}")
  public void handleChat(
      @DestinationVariable String userId,
      @Valid @Payload SendMessageRequest request
  ) {
    ChatMessage saved = store.save(request);
    template.convertAndSend("/topic/chat/" + userId, saved);
  }

  @RestController
  @RequestMapping("/api/chat")
  @CrossOrigin(origins = "*")
  static class ChatRestController {
    private final ChatStore store;

    ChatRestController(ChatStore store) {
      this.store = store;
    }

    @GetMapping("/messages/{userId}")
    public List<ChatMessage> messages(@PathVariable String userId) {
      return store.getMessages(userId);
    }

    @org.springframework.web.bind.annotation.PostMapping("/messages")
    public ChatMessage send(@Valid @org.springframework.web.bind.annotation.RequestBody SendMessageRequest req) {
      return store.save(req);
    }

    @GetMapping("/conversations")
    public List<ConversationSummary> conversations() {
      return store.getSummaries();
    }
  }
}
