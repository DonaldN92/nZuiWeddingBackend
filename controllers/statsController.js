const Guest = require('../models/Guest');

// @desc    Obtenir des statistiques avancées
// @route   GET /api/admin/stats
// @access  Admin
const getAdvancedStats = async (req, res) => {
  try {
    const { range } = req.query;
    
    const totalGuests = await Guest.countDocuments();
    const attendingCount = await Guest.countDocuments({ isAttending: true });
    const declinedCount = await Guest.countDocuments({ isAttending: false, responded: true });
    const notRespondedCount = await Guest.countDocuments({ responded: false });
    
    // Calcul des réponses par jour
    const responsesByDay = await Guest.aggregate([
      { 
        $match: { 
          updatedAt: { 
            $gte: getDateRange(range) 
          } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      totalGuests,
      attendingCount,
      declinedCount,
      notRespondedCount,
      responseRate: Math.round((attendingCount + declinedCount) / totalGuests * 100),
      responsesByDay,
      invitationsSent: await Guest.countDocuments({ invitationSent: true }),
      invitationsSentThisPeriod: await Guest.countDocuments({ 
        invitationSent: true,
        updatedAt: { $gte: getDateRange(range) }
      })
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

function getDateRange(range) {
  const now = new Date();
  switch (range) {
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    default:
      return new Date(0); // Toutes les dates
  }
}

module.exports = { getAdvancedStats };