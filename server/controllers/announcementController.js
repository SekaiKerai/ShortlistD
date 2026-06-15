const Announcement = require("../models/Announcement");

const createAnnouncement = async (req, res) => {
  try {
    const { title, message, priority } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      priority,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({
        createdAt: -1,
      })
      .limit(10);

    return res.status(200).json({
      success: true,
      announcements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    await announcement.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Announcement deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
};
