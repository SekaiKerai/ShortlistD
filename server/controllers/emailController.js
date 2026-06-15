const User = require("../models/User");

const sendEmail = require("../utils/sendEmail");

const sendBulkEmail = async (req, res) => {
  try {
    const { studentIds, subject, message } = req.body;

    const students = await User.find({
      _id: {
        $in: studentIds,
      },
    });

    await Promise.all(
      students.map((student) =>
        sendEmail({
          to: student.email,
          subject,
          html: `
                <div style="font-family:sans-serif;padding:20px">
                  <h2>${subject}</h2>
                  <p>Hello ${student.name},</p>
                  <p>${message}</p>
                  <br/>
                  <p>Regards,</p>
                  <p><strong>Training & Placement Cell</strong></p>
                </div>
              `,
        }),
      ),
    );

    return res.status(200).json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendBulkEmail,
};
