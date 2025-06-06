const express = require("express");
const router = express.Router();
const verifyTeacher = require("../routes/verifyTeacher");

const db = require("../models");
const Feedback = db.Feedback;
const Responses = db.Response;
const Student = db.Student;
const Class = db.Class;
const Course = db.Course;

// post feedback for a response
// type can be either text or emoji
router.post("/", verifyTeacher, async (req, res) => {
  // content is the feedback text or emoji
  // responseId is the id of the response being feedbacked on
  const { content, responseId, type } = req.body;

  try {
    if (!content || !responseId || !type) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!["text", "emoji"].includes(type)) {
      return res.status(400).json({ message: "Invalid type value. Must be 'text' or 'emoji'." });
    }

    const response = await Responses.findByPk(responseId);
    if (!response) {
      return res.status(404).json({ message: "Response not found." });
    }
   
    // if it is emoji feedback, check if it already exists
    // if it exists, update it
    if (type === "emoji") {
      const { updated, feedback } = await handleEmojiFeedbackUpdate(responseId, content);
      if (updated) {
        return res.status(200).json({ message: "Emoji feedback updated.", feedback });
      }
    }
    // if not, create new feedback
    const newFeedback = await Feedback.create({ content, responseId, type });
    return res.status(201).json({ message: "Feedback submitted.", feedback: newFeedback });

  } catch (error) {
    console.error("Submit feedback error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// encapsulate the logic for handling emoji feedback update
// this function checks if the emoji feedback already exists for the responseId
async function handleEmojiFeedbackUpdate(responseId, content) {
  // default value for existingEmojiFeedback
  let existingEmojiFeedback = null;

  existingEmojiFeedback = await Feedback.findOne({
    where: { responseId, type: "emoji" }
  });

  // if it exists, update it
  // if it doesn't exist, create new feedback
  if (existingEmojiFeedback) {
    existingEmojiFeedback.content = content;
    await existingEmojiFeedback.save();
    return { updated: true, feedback: existingEmojiFeedback };
  }

  return { updated: false };
}


// get all feedbacks for a response
// responseId is the id of the response being feedbacked on
router.get("/:id", async (req, res) => {
  const responseId = req.params.id;

  try {
    const response = await Responses.findByPk(responseId);
    if (!response) {
      return res.status(404).json({ message: "Response not found." });
    }

    // get all feedbacks for this response
    const feedbackList = await Feedback.findAll({
      where: { responseId }
    });

    return res.status(200).json(feedbackList);
  } catch (error) {
    console.error("Get feedback error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Set all feedbacks of a response to have read
router.patch("/markRead", async (req, res) => {
  // responseId is the id of the response being feedbacked on
  const { responseId } = req.body;

  try {
    if (!responseId) {
      return res.status(400).json({ message: "Missing responseId." });
    }

    // set all feedbacks of this response to have read
    const [updatedCount] = await Feedback.update(
      { isUnread: false },
      { where: { responseId: responseId, isUnread: true } }
    );

    return res.status(200).json({ message: `${updatedCount} feedback(s) marked as read.` });
  } catch (error) {
    console.error("Batch update feedback error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// edit a specific feedback
router.put("/edit/:id", async (req, res) => {
  const feedbackId = req.params.id;
  const { content } = req.body;

  try {
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty." });
    }

    feedback.content = content;
    feedback.isEdited = true;
    await feedback.save();

    return res.status(200).json({ message: "Feedback updated.", feedback });
  } catch (error) {
    console.error("Update feedback error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// delete a specific feedback
router.delete("/delete/:id", async (req, res) => {
  const feedbackId = req.params.id;

  try {
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    await feedback.destroy();

    return res.status(200).json({ message: "Feedback deleted successfully." });
  } catch (error) {
    console.error("Delete feedback error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// student reaction to feedback
// feedbackId is the id of the feedback being reacted to
router.post("/react/:id", async (req, res) => {
  const feedbackId = req.params.id;
  const { like } = req.body;

  if (typeof like !== "boolean") {
    return res.status(400).json({ message: "Invalid like value. Must be true or false." });
  }

  try {
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    if (feedback.type !== "text") {
      return res.status(400).json({ message: "Only text feedback can receive reactions." });
    }

    feedback.like = like;
    await feedback.save();

    return res.status(200).json({ message: "Reaction saved.", feedback });
  } catch (error) {
    console.error("Submit like error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
