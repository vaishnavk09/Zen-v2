/**
 * Mental Health Knowledge Base
 * Rich therapeutic documents for RAG retrieval.
 * Each Document has pageContent (text) and metadata (topic, type).
 */
const { Document } = require('@langchain/core/documents');

const mentalHealthDocuments = [

  // ─── ANXIETY ────────────────────────────────────────────────
  new Document({
    pageContent: `Anxiety management: Box breathing (4-4-4-4) is one of the most effective immediate techniques. Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 cycles. This activates the parasympathetic nervous system and reduces cortisol. Use it before high-stress situations or during panic onset.`,
    metadata: { topic: 'anxiety', type: 'technique', subtopic: 'breathing' }
  }),
  new Document({
    pageContent: `Grounding for anxiety — the 5-4-3-2-1 technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This interrupts the anxiety spiral by anchoring your awareness to the present moment. It works by engaging sensory cortex and breaking the rumination loop.`,
    metadata: { topic: 'anxiety', type: 'technique', subtopic: 'grounding' }
  }),
  new Document({
    pageContent: `Cognitive restructuring for anxiety: Anxious thoughts often involve catastrophizing ("everything will go wrong") or fortune-telling ("I know it will fail"). Challenge them by asking: What evidence supports this thought? What's the realistic best/worst/most likely outcome? Would I say this to a friend? This CBT approach rewires anxious thought patterns over time.`,
    metadata: { topic: 'anxiety', type: 'cbt', subtopic: 'cognitive' }
  }),
  new Document({
    pageContent: `Progressive Muscle Relaxation (PMR) for anxiety: Tense each muscle group for 5 seconds then release for 30 seconds. Start from toes, work upward: feet, calves, thighs, abdomen, hands, arms, shoulders, face. PMR breaks the physical tension cycle that reinforces anxiety. Best practiced daily for 10–20 minutes.`,
    metadata: { topic: 'anxiety', type: 'technique', subtopic: 'body' }
  }),
  new Document({
    pageContent: `Social anxiety coping: Prepare conversation starters in advance. Focus on being curious about the other person rather than monitoring yourself. After social events, avoid reviewing what went "wrong" — this fuels the cycle. Gradual exposure to feared situations, paired with self-compassion, is the most evidence-based approach.`,
    metadata: { topic: 'anxiety', type: 'social', subtopic: 'coping' }
  }),

  // ─── DEPRESSION ─────────────────────────────────────────────
  new Document({
    pageContent: `Depression and behavioral activation: Depression creates a withdrawal cycle — low mood leads to inactivity, which deepens low mood. Behavioral activation breaks this by scheduling small, manageable activities that once brought pleasure or mastery. Start with 5-minute activities. The mood follows the behavior, not the other way around.`,
    metadata: { topic: 'depression', type: 'cbt', subtopic: 'behavioral_activation' }
  }),
  new Document({
    pageContent: `Self-compassion for depression: Depression often comes with harsh self-criticism. Practice the self-compassion break: acknowledge "this is a moment of suffering," remind yourself "suffering is part of being human," and offer yourself kindness ("may I be kind to myself right now"). Research shows self-compassion is more effective than self-esteem for wellbeing.`,
    metadata: { topic: 'depression', type: 'technique', subtopic: 'self_compassion' }
  }),
  new Document({
    pageContent: `Cognitive distortions in depression: All-or-nothing thinking ("I failed once, I'm a failure"), overgeneralization, mental filter (focusing only on negatives), disqualifying the positive, mind reading, should statements. Identifying the specific distortion is the first step to challenging it using thought records.`,
    metadata: { topic: 'depression', type: 'cbt', subtopic: 'cognitive' }
  }),
  new Document({
    pageContent: `Depression and physical health: Exercise has been shown in meta-analyses to be as effective as antidepressants for mild-to-moderate depression. Even a 20-minute walk increases BDNF (brain-derived neurotrophic factor), serotonin, and endorphins. Sleep regularization and reduced alcohol also have significant impact.`,
    metadata: { topic: 'depression', type: 'lifestyle', subtopic: 'physical' }
  }),

  // ─── STRESS ─────────────────────────────────────────────────
  new Document({
    pageContent: `Stress management — identify your stressors: Use a stress journal to track what triggers stress, your physical/emotional response, and how you coped. Patterns will emerge. Categorize stressors: controllable vs uncontrollable. Focus energy only on controllable stressors using problem-solving; for uncontrollable ones, use acceptance and emotion regulation.`,
    metadata: { topic: 'stress', type: 'technique', subtopic: 'awareness' }
  }),
  new Document({
    pageContent: `Time management to reduce stress: Use the Eisenhower Matrix — categorize tasks as Urgent+Important (do now), Important+Not Urgent (schedule), Urgent+Not Important (delegate), Neither (eliminate). The biggest stress reducer is working on Important+Not Urgent tasks before they become urgent. Set boundaries on your time.`,
    metadata: { topic: 'stress', type: 'technique', subtopic: 'time_management' }
  }),
  new Document({
    pageContent: `Work stress and burnout prevention: Burnout has three dimensions — exhaustion, cynicism, and reduced efficacy. Early signs: chronic fatigue, irritability, detachment, frequent illness. Prevention: set clear work-life boundaries, take real breaks, maintain social connections, find meaning in small wins. Recovery requires rest first, then gradual re-engagement.`,
    metadata: { topic: 'stress', type: 'burnout', subtopic: 'work' }
  }),

  // ─── SLEEP ──────────────────────────────────────────────────
  new Document({
    pageContent: `Sleep hygiene — CBT-I principles: Stimulus control: use bed only for sleep/sex. Sleep restriction: compress sleep window to build sleep drive. Consistent wake time regardless of sleep quality. Avoid clock-watching. No screens 60 minutes before bed (blue light suppresses melatonin). Keep room cool (65-68°F / 18-20°C), dark, and quiet.`,
    metadata: { topic: 'sleep', type: 'cbt', subtopic: 'hygiene' }
  }),
  new Document({
    pageContent: `Insomnia and racing thoughts at bedtime: If you can't sleep after 20 minutes, get up and do a calm activity in dim light until sleepy. Write worries in a journal before bed to "offload" them from your mind. Try the 4-7-8 breathing: inhale 4 counts, hold 7, exhale 8. This activates the vagal brake and promotes sleep onset.`,
    metadata: { topic: 'sleep', type: 'technique', subtopic: 'insomnia' }
  }),

  // ─── MINDFULNESS ────────────────────────────────────────────
  new Document({
    pageContent: `Mindfulness meditation — beginner practice: Sit comfortably, close eyes. Focus on the natural breath — the sensation at the nostrils, chest, or abdomen. When mind wanders (it will), gently return attention without judgment. Start with 5 minutes daily. Research shows 8 weeks of consistent practice reduces amygdala reactivity and improves emotional regulation.`,
    metadata: { topic: 'mindfulness', type: 'technique', subtopic: 'meditation' }
  }),
  new Document({
    pageContent: `Body scan meditation: Lie down or sit. Slowly move attention from the top of the head down through the body — forehead, jaw, neck, shoulders, chest, abdomen, hips, legs, feet. Notice sensations without trying to change them. This practice develops interoceptive awareness and is evidence-based for chronic pain and anxiety.`,
    metadata: { topic: 'mindfulness', type: 'technique', subtopic: 'body_scan' }
  }),
  new Document({
    pageContent: `Mindfulness in daily life: Practice informal mindfulness — fully engage with one activity at a time. When eating, just eat (no phone). When walking, notice each step. These micro-practices build the same neural pathways as formal meditation. STOP practice: Stop, Take a breath, Observe (body/thoughts/feelings), Proceed.`,
    metadata: { topic: 'mindfulness', type: 'technique', subtopic: 'daily' }
  }),

  // ─── SELF-CARE ──────────────────────────────────────────────
  new Document({
    pageContent: `Self-care framework — four domains: Physical (sleep, nutrition, movement, medical care), Emotional (journaling, therapy, creative expression, setting boundaries), Social (quality time with supportive people, community), Spiritual (meaning-making, values-based living, gratitude). Sustainable self-care is scheduled, not reactive.`,
    metadata: { topic: 'self_care', type: 'framework', subtopic: 'domains' }
  }),
  new Document({
    pageContent: `Journaling for mental health: Expressive writing (writing about difficult emotions for 15–20 minutes) has been shown to reduce depression and anxiety in clinical studies. Gratitude journaling (3 specific things daily) shifts attentional bias toward positives. Bullet journaling helps with cognitive overload and planning.`,
    metadata: { topic: 'self_care', type: 'technique', subtopic: 'journaling' }
  }),

  // ─── COPING MECHANISMS ──────────────────────────────────────
  new Document({
    pageContent: `Healthy vs unhealthy coping strategies: Healthy: exercise, talking to someone, journaling, problem-solving, creative outlets, rest, mindfulness. Unhealthy: alcohol/substances, avoidance, excessive screen time, emotional eating, self-harm, social isolation. Unhealthy coping provides short-term relief but amplifies long-term distress.`,
    metadata: { topic: 'coping', type: 'framework', subtopic: 'strategies' }
  }),
  new Document({
    pageContent: `Distress tolerance — TIPP skills: Temperature (cold water on face activates dive reflex, reducing emotional intensity), Intense exercise (burns off adrenaline), Paced breathing (slow exhale activates parasympathetic), Paired muscle relaxation. TIPP skills from DBT are for managing overwhelming emotions in the moment.`,
    metadata: { topic: 'coping', type: 'dbt', subtopic: 'distress_tolerance' }
  }),
  new Document({
    pageContent: `Emotional regulation — PLEASE skills (DBT): treat PhysicaL illness, balanced Eating, Avoid mood-altering substances, balanced Sleep, get Exercise. These biological factors have a massive impact on emotional vulnerability. When these are neglected, emotional regulation becomes much harder regardless of psychological skills.`,
    metadata: { topic: 'coping', type: 'dbt', subtopic: 'emotion_regulation' }
  }),

  // ─── RELATIONSHIPS & SOCIAL ─────────────────────────────────
  new Document({
    pageContent: `Social support and mental health: Strong social connections are one of the most robust predictors of mental health and longevity. Quality matters more than quantity — one or two deeply trusting relationships is more protective than many superficial ones. If you feel isolated, start with low-stakes connections: a class, volunteer work, or online community.`,
    metadata: { topic: 'relationships', type: 'framework', subtopic: 'social_support' }
  }),
  new Document({
    pageContent: `Setting healthy boundaries: A boundary is a limit that defines where you end and others begin. Signs you need better boundaries: resentment, exhaustion, feeling responsible for others' emotions. Practice: state the boundary clearly and calmly ("I'm not available after 8pm"), state the consequence, follow through. Boundaries are not punishment — they are self-respect.`,
    metadata: { topic: 'relationships', type: 'technique', subtopic: 'boundaries' }
  }),

  // ─── CRISIS RESOURCES ───────────────────────────────────────
  new Document({
    pageContent: `India mental health crisis resources: iCall (TISS): 9152987821 — trained psychologists, free, Mon-Sat 8am-10pm. Vandrevala Foundation: 1860-2662-345 — 24/7, free, multilingual. AASRA: 9820466627 — 24/7 suicide prevention. iCall also offers email counseling at icall@tiss.edu. NIMHANS helpline: 080-46110007.`,
    metadata: { topic: 'crisis', type: 'resources', subtopic: 'helplines' }
  }),
  new Document({
    pageContent: `When to seek professional help: Consider therapy if distress persists beyond 2 weeks, impacts work/relationships/daily functioning, involves thoughts of self-harm, or involves trauma. Types of therapy: CBT (anxiety, depression), DBT (emotional dysregulation), EMDR (trauma), ACT (acceptance-based). In India, NIMHANS and iCall offer affordable/free services.`,
    metadata: { topic: 'crisis', type: 'guidance', subtopic: 'professional_help' }
  }),

  // ─── GRIEF & LOSS ───────────────────────────────────────────
  new Document({
    pageContent: `Grief: There is no right timeline or sequence. The Kübler-Ross stages (denial, anger, bargaining, depression, acceptance) are not linear — most people move between them non-linearly. Allow yourself to grieve without judgment. Grief is the price of love, not a disorder. Support: grief groups, bereavement counseling, expressive writing.`,
    metadata: { topic: 'grief', type: 'framework', subtopic: 'understanding' }
  }),

  // ─── SELF-ESTEEM ────────────────────────────────────────────
  new Document({
    pageContent: `Building self-esteem: Self-esteem is built through mastery experiences (doing hard things), not through positive thinking alone. Set small, achievable goals and complete them. Keep a "wins journal" — write one thing you did well daily. Challenge your inner critic: would you speak to a friend this way? Self-compassion, not self-esteem, predicts long-term wellbeing.`,
    metadata: { topic: 'self_esteem', type: 'technique', subtopic: 'building' }
  }),
];

module.exports = { mentalHealthDocuments };
