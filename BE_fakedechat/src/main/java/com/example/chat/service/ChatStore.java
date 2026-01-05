package com.example.chat.service;

import com.example.chat.dto.ConversationSummary;
import com.example.chat.dto.SendMessageRequest;
import com.example.chat.model.ChatMessage;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class ChatStore {
  private final Map<String, List<ChatMessage>> conversations = new ConcurrentHashMap<>();

  public ChatMessage save(SendMessageRequest req) {
    ChatMessage message = new ChatMessage(req.getUserId(), req.getFrom(), req.getText());
    conversations.computeIfAbsent(req.getUserId(), k -> new ArrayList<>()).add(message);
    return message;
  }

  public List<ChatMessage> getMessages(String userId) {
    return conversations.getOrDefault(userId, List.of()).stream()
        .sorted(Comparator.comparing(ChatMessage::getCreatedAt))
        .toList();
  }

  public List<ConversationSummary> getSummaries() {
    List<ConversationSummary> list = new ArrayList<>();
    for (Map.Entry<String, List<ChatMessage>> entry : conversations.entrySet()) {
      List<ChatMessage> msgs = entry.getValue();
      msgs.sort(Comparator.comparing(ChatMessage::getCreatedAt));
      ChatMessage last = msgs.isEmpty() ? null : msgs.get(msgs.size() - 1);
      list.add(new ConversationSummary(
          entry.getKey(),
          last != null ? last.getText() : "",
          last != null ? last.getCreatedAt() : null,
          msgs.size()
      ));
    }
    list.sort((a, b) -> {
      Instant at = a.getLastTime() != null ? a.getLastTime() : Instant.EPOCH;
      Instant bt = b.getLastTime() != null ? b.getLastTime() : Instant.EPOCH;
      return bt.compareTo(at);
    });
    return list;
  }
}
