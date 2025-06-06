const express = require("express");
const router = express.Router();
const { Student, Class, Response, Course, Teacher } = require("../models")
const { Op } = require('sequelize')

// get a record from table and use it as the argument of a function
async function lookup_pk(table, pk, res, fn, options=null) {
  try {
    const record = await table.findByPk(pk, options)
    if (!record) {
      return res.sendStatus(404)
    }
    await fn(record)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

// get all responses of a student
router.get("/byStudent/:id", async (req, res) => {
  const std_id = req.params.id
  lookup_pk(Student, std_id, res, async student => {
    const student_responses = await student.getResponses()
    res.json(student_responses)
  })
});

// student submits a response
router.post("/byStudent", async (req, res) => {
  const {studentId, classId, text, isAnonymous} = req.body
  try {
    const { id } = await Response.create({studentId, classId, text, isAnonymous})
    res.send(id)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
});

// get all responses of a class
router.get("/byClass/:id", async (req, res) => {
  const cls_id = req.params.id
  const time = req.query.after
  // possiblely only include responses sent after a timestamp
  const where = time ? { createdAt: { [Op.gt]: new Date(time) } } : {}

  lookup_pk(Class, cls_id, res, async cls => {
    const class_responses = await cls.getResponses({
      include: {
        model: Student,
        attributes: ['name']
      },
      where
    })
    res.json(class_responses)
  })
});

// get all responses of a course
router.get("/byCourse/:id", async (req, res) => {
  const course_id = req.params.id
  const time = req.query.after
  // possiblely only include responses sent after a timestamp
  const where = time ? { createdAt: { [Op.gt]: new Date(time) } } : {}

  lookup_pk(Course, course_id, res, async course => {
    const course_responses = await Response.findAll({
      include: [
        {
          model: Student,
          attributes: ['name']
        },
        {
          model: Class,
          where: { courseId: course_id }
        },
      ],
      where
    })
    res.json(course_responses)
  })
});

// get all responses of a teacher
router.get("/byTeacher/:id", async (req, res) => {
  const teacher_id = req.params.id
  const time = req.query.after
  // possiblely only include responses sent after a timestamp
  const where = time ? { createdAt: { [Op.gt]: new Date(time) } } : {}

  lookup_pk(Teacher, teacher_id, res, async teacher => {
    const teacher_responses = await Response.findAll({
      include: [
        {
          model: Student,
          attributes: ['name']
        },
        {
          model: Class,
          required: true,
          include: {
            model: Course,
            where: { teacherId: teacher_id }
          }
        },
      ],
      where
    })
    res.json(teacher_responses)
  })
});

// get all classes of a course
router.get("/classes/byCourse/:id", async (req, res) => {
  const course_id = req.params.id
  lookup_pk(Course, course_id, res, async course => {
    const classes = await course.getClasses()
    res.json(classes)
  })
});

// get all courses of a teacger
router.get("/courses/byTeacher/:id", async (req, res) => {
  const teacher_id = req.params.id
  lookup_pk(Teacher, teacher_id, res, async teacher => {
    const courses = await teacher.getCourses()
    res.json(courses)
  })
});

// get all students in a class (session)
router.get("/students/byClass/:id", async (req, res) => {
  const class_id = req.params.id
  lookup_pk(Class, class_id, res, async cls => {
    const students = await cls.getStudents()
    res.json(students)
  })
});

// get a single response
router.get("/:id", async (req, res) => {
  const id = req.params.id
  lookup_pk(Response, id, res, response => res.json(response), {
    include: {
      model: Student,
      attributes: ['name'],
    },
  })
});

// edit response text in or mark as read/unread
router.put("/", async (req, res) => {
  const updatable_fields = ['text', 'isUnread']
  const new_response = req.body
  const updates = {};

  lookup_pk(Response, new_response.id, res, async response => {
    for (const field of updatable_fields) {
      if (field in new_response && new_response[field] != response[field]) {
        updates[field] = new_response[field]

        // mark as unread if reponse text is updated
        if (field == 'text') {
          updates.isUnread = true
          updates.isEdited = true
        }
      }
    }
    if (updates) {
      await response.update(updates)
    }
    res.sendStatus(200)
  })
});

// delete a response
router.delete("/:id", async (req, res) => {
  const id = req.params.id
  lookup_pk(Response, id, res, async response => {
    await response.destroy()
    res.sendStatus(200)
  })
});

router.patch("/markRead/:id", async (req, res) => {
  const id = req.params.id
  lookup_pk(Response, id, res, async response => {
    if (response.isUnread) {
      await response.update({ isUnread: false });
    }
    res.sendStatus(200);
  });
});

module.exports = router;
