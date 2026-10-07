# 17 - Chat UI (Frontend Only)

## Description
A polished messaging interface mock-up with a conversations sidebar, chat bubbles, timestamps, animated typing indicator, and simulated bot replies. No backend required — everything runs in the browser with vanilla JS.

## Features
- Conversation list with avatars, previews and unread badges
- Switch between chats; each keeps its own history
- Send messages with Enter or the send button
- Animated three-dot typing indicator + randomized auto-replies
- Search/filter conversations
- Slide-in sidebar drawer on mobile/tablet
- XSS-safe message rendering, ARIA live message log

## Technologies Used
HTML5, CSS3 (Flexbox, custom properties, keyframe animations), Vanilla JavaScript

## How to Run
```bash
cd "17-chat-ui"
python3 -m http.server 8000   # or just open index.html
```

## Main Functionality
Pick a conversation → type a message → it appears as a bubble with timestamp → after a short delay the contact "types" and replies. Unread counts update for background chats; the search box filters the sidebar.
