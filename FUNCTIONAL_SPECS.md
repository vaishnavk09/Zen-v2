# Zen Wellness App - Functional Specifications

## 1. Product Overview
**Zen** is a comprehensive, privacy-first mental health support platform designed to help users manage anxiety, reduce stress, and improve their overall emotional well-being. By combining traditional self-reflection tools with advanced, AI-driven conversational support, Zen provides a holistic approach to mental wellness.

## 2. User Needs & Target Audience
**Target Audience**: 
Individuals experiencing stress, anxiety, low mood, or general mental health challenges who require accessible, on-demand self-help tools and a safe space for emotional reflection.

**Core User Needs**:
- **Immediate Support**: Users need an always-available sounding board when feeling overwhelmed, anxious, or depressed.
- **Emotional Tracking**: Users need a structured way to track their emotional states to identify triggers and patterns over time.
- **Safe Reflection**: Users need a private, secure space to journal their thoughts without fear of judgment.
- **Crisis Safety**: Vulnerable users need immediate access to professional crisis resources if their mental state deteriorates.
- **Actionable Coping**: Users need practical, evidence-based exercises (e.g., breathing techniques, CBT strategies) to handle acute stress.

## 3. Functional Requirements

### 3.1 AI Chatbot (RAG-Powered)
*Translates the need for immediate, empathetic support.*
- **System Capability**: An intelligent chatbot powered by a Large Language Model (e.g., LLaMA 3) and Retrieval-Augmented Generation (RAG) using Langchain.
- **Conversational Memory**: The system must maintain session history (via MongoDB) to provide context-aware responses.
- **Evidence-Based Context**: The bot retrieves coping mechanisms and strategies from a curated mental health knowledge base, utilizing few-shot prompting and Chain-of-Thought (CoT) reasoning to ensure responses are empathetic, structured, and safe.
- **Crisis Detection Middleware**: The system must actively scan user inputs for high-risk keywords (e.g., "suicide", "self harm"). If detected, the system immediately bypasses standard LLM processing to deliver hardcoded emergency contact information (e.g., iCall, AASRA, Vandrevala Foundation).

### 3.2 Mood Tracker
*Translates the need for emotional tracking and pattern recognition.*
- **System Capability**: Users can log their daily mood on a scale of 1 to 10.
- **Contextual Data**: Users can append notes, select specific tags (e.g., "anxious", "happy"), and log associated activities to help identify mood triggers.
- **Historical View**: The system stores all historical mood data, allowing users to review their emotional trajectory over time.

### 3.3 Journaling System
*Translates the need for safe, private reflection.*
- **System Capability**: A secure CRUD (Create, Read, Update, Delete) interface for personal diary entries.
- **Data Structure**: Each entry must capture a title, rich-text/plain-text content, and a timestamp.
- **Privacy**: Entries must be strictly tied to the authenticated user's account, ensuring complete data privacy.

### 3.4 Guided Breathing Exercises
*Translates the need for actionable stress relief.*
- **System Capability**: A frontend module guiding users through established breathing exercises (e.g., box breathing) using visual cues to regulate the nervous system during acute anxiety spikes.

### 3.5 Authentication & Security
*Translates the need for absolute privacy and trust.*
- **System Capability**: Secure user registration and login system.
- **Mechanism**: JWT (JSON Web Tokens) based authentication ensuring that sensitive mental health data (chats, moods, journals) is strictly siloed and protected.

## 4. Success Metrics (What Success Looks Like)

### User Engagement & Retention
- **Feature Adoption**: High percentage of Daily Active Users (DAU) engaging with the Mood Tracker and Journal features.
- **Session Depth**: Average chat session length indicates meaningful engagement rather than immediate drop-offs.

### Efficacy & Safety
- **Crisis Intervention**: 100% accuracy in the crisis detection middleware triggering the emergency response payload without false negatives.
- **Response Quality**: The RAG pipeline consistently delivers empathetic, non-diagnostic, and actionable advice, adhering strictly to the system prompts without hallucinations.

### Technical Performance
- **Latency**: Fast response times from the AI Chatbot (leveraging optimized inference engines like Groq) to ensure users in distress are not kept waiting.
- **Reliability**: Zero data leakage between user sessions; seamless persistence of chat history and journal entries.

## 5. Out of Scope / System Limits
- **Medical Diagnosis**: The system is explicitly designed *not* to diagnose mental health conditions or prescribe medication.
- **Therapist Replacement**: The application acts as a supplementary self-help tool, not a substitute for professional psychiatric or psychological intervention.
