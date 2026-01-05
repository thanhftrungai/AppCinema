package com.example.chat.dto;

import java.time.Instant;

public class ConversationSummary {
  private String userId;
  private String lastMessage;
  private Instant lastTime;
  private long total;

  public ConversationSummary(String userId, String lastMessage, Instant lastTime, long total) {
    this.userId = userId;
    this.lastMessage = lastMessage;
    this.lastTime = lastTime;
    this.total = total;
  }

  public String getUserId() {
    return userId;
  }

  public String getLastMessage() {
    return lastMessage;
  }

  public Instant getLastTime() {
    return lastTime;
  }

  public long getTotal() {
    return total;
  }
}
