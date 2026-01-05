package com.example.chat.dto;

import jakarta.validation.constraints.NotBlank;

public class SendMessageRequest {
  @NotBlank
  private String userId;

  @NotBlank
  private String text;

  @NotBlank
  private String from; // "admin" | "user"

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public String getFrom() {
    return from;
  }

  public void setFrom(String from) {
    this.from = from;
  }
}
