const crisisKeywords = [
    'suicide', 'kill myself', 'end my life',
    'self harm', 'hurt myself', 'want to die',
    'no reason to live', 'can\'t go on'
  ];
  
  module.exports = (req, res, next) => {
    const message = req.body.message?.toLowerCase() || '';
    const isCrisis = crisisKeywords.some(k => message.includes(k));
  
    if (isCrisis) {
      return res.json({
        success: true,
        data: {
          userMessage: {
            _id: `u-${Date.now()}`,
            message: req.body.message,
            isUser: true,
            createdAt: new Date().toISOString()
          },
          botMessage: {
            _id: `b-${Date.now()}`,
            message: `I hear you, and I'm really concerned about you. Please reach out for immediate help right now:\n\n🆘 **iCall:** 9152987821\n🆘 **Vandrevala Foundation:** 1860-2662-345\n🆘 **AASRA:** 9820466627\n\nYou are not alone, and your life matters. 💙`,
            isUser: false,
            createdAt: new Date().toISOString()
          }
        }
      });
    }
    next();
  };