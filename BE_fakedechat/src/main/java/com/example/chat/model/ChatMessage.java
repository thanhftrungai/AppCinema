package com.example.chat.model;

import java.time.Instant;
import java.util.UUID;

public class ChatMessage {
  private String id;
  private String userId;
  private String from; // "admin" | "user"
  private String text;
  private Instant createdAt;

  public ChatMessage() {}

  public ChatMessage(String id, String userId, String from, String text, Instant createdAt) {
    this.id = id;
    this.userId = userId;
    this.from = from;
    this.text = text;
    this.createdAt = createdAt;
  }

  public ChatMessage(String userId, String from, String text) {
    this.id = UUID.randomUUID().toString();
    this.userId = userId;
    this.from = from;
    this.text = text;
    this.createdAt = Instant.now();
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getFrom() {
    return from;
  }

  public void setFrom(String from) {
    this.from = from;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
