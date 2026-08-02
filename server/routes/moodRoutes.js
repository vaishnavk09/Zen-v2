const express = require('express');
const {
  getMoods,
  getMood,
  createMood,
  updateMood,
  deleteMood,
  getMoodInsights
} = require('../controllers/moodController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/mood/insights:
 *   get:
 *     summary: Get AI-powered emotional correlation insights
 *     description: Analyzes the last 14 days of mood logs using LLaMA 3.3 70B to generate personalized emotional patterns, stability scores, and wellness recommendations.
 *     tags: [Mood Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI-generated insights successfully returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     insights:
 *                       type: string
 *                       description: Warm, empathetic 2-3 sentence emotional pattern summary
 *                     stabilityScore:
 *                       type: integer
 *                       description: Emotional stability score 1-100
 *                     topTriggers:
 *                       type: array
 *                       items:
 *                         type: string
 *                     recommendation:
 *                       type: string
 *                     averageMood:
 *                       type: number
 *                     totalEntries:
 *                       type: integer
 *       401:
 *         description: Unauthorized - JWT required
 */
router.get('/insights', protect, getMoodInsights);

/**
 * @swagger
 * /api/mood:
 *   get:
 *     summary: Get all mood entries for the authenticated user
 *     tags: [Mood Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of mood entries
 *   post:
 *     summary: Create a new mood entry
 *     tags: [Mood Tracker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mood]
 *             properties:
 *               mood:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               notes:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               activities:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Mood entry created
 */
router.route('/')
  .get(protect, getMoods)
  .post(protect, createMood);

/**
 * @swagger
 * /api/mood/{id}:
 *   get:
 *     summary: Get a single mood entry by ID
 *     tags: [Mood Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mood entry returned
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a mood entry
 *     tags: [Mood Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mood entry updated
 *   delete:
 *     summary: Delete a mood entry
 *     tags: [Mood Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mood entry deleted
 */
router.route('/:id')
  .get(protect, getMood)
  .put(protect, updateMood)
  .delete(protect, deleteMood);

module.exports = router;