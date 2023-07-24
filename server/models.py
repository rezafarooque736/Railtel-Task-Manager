from exts import db

# user model
"""
class User:
    id:integer
    username:string
    email:string
    password:string
    created_at:string
    otp:string
"""


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(80), nullable=False, unique=True)
    department = db.Column(db.String(), nullable=False)
    password = db.Column(db.Text(), nullable=False)
    created_at = db.Column(db.String(), nullable=False)
    otp = db.Column(db.String(6), nullable=False)

    def __repr__(self):
        return f"<User {self.email}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, password):
        self.password = password
        db.session.commit()

    def update_otp(self, otp):
        self.otp = otp
        db.session.commit()

    def upadte_password(self, otp, password):
        self.otp = otp
        self.password = password
        db.session.commit()


# user model
"""
class Register_Temp:
    id:integer
    email:string
    otp:string
"""


class Register_Temp(db.Model):
    __tablename__ = "register_temp"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), nullable=False, unique=True)
    otp = db.Column(db.String(6), nullable=False)

    def __repr__(self):
        return f"<Register_Temp {self.email}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update_otp(self, otp):
        self.otp = otp
        db.session.commit()


class Task(db.Model):
    __tablename__ = "task"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(65), nullable=False)
    description = db.Column(db.Text(), nullable=False)
    action_team = db.Column(db.Text(), nullable=False)
    info_team = db.Column(db.Text(), nullable=False)
    date_time_create = db.Column(db.String(), nullable=False)
    date_time_archive = db.Column(db.String())
    date_time_update = db.Column(db.String())
    created_by = db.Column(db.String(50), nullable=False)
    isArchived = db.Column(db.Integer, nullable=False)
    archive_by = db.Column(db.String(50))
    taskProgress = db.Column(db.Integer, nullable=False, default=0)
    commentsR = db.relationship("TaskCommentTable", backref="task")

    def __repr__(self):
        return f"<Task {self.id}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(
        self,
        title,
        description,
        action_team,
        info_team,
        date_time_create,
        date_time_archive,
        created_by,
        isArchived,
        archive_by,
    ):
        self.title = title
        self.description = description
        self.action_team = action_team
        self.info_team = info_team
        self.date_time_create = date_time_create
        self.date_time_archive = date_time_archive
        self.created_by = created_by
        self.isArchived = isArchived
        self.archive_by = archive_by
        db.session.commit()

    def archive(self, date_time_archive, isArchived, archive_by):
        self.date_time_archive = date_time_archive
        self.isArchived = isArchived
        self.archive_by = archive_by
        db.session.commit()

    def unarchive(self, isArchived):
        self.isArchived = isArchived
        db.session.commit()

    def addNewActionTeam(self, action_team):
        self.action_team = action_team
        db.session.commit()

    def addNewInfoTeam(self, info_team):
        self.info_team = info_team
        db.session.commit()

    def update_new_description(self, description):
        self.description = description
        db.session.commit()

    def date_time_update_function(self, epoch_time):
        self.date_time_update = epoch_time
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def updateProgressBar(self, taskProgress):
        self.taskProgress = taskProgress
        db.session.commit()


# Task Comment Table Model
"""
class TaskCommentTable
    CommentId: int primary_key
    TaskId: int
    CommentBy:string
    CommentBody:text
    comment_date_time: string
    old_filename: string
    new_filename: string
    file_url: string
"""


class TaskCommentTable(db.Model):
    __tablename__ = "TaskCommentTable"
    CommentId = db.Column(db.Integer, primary_key=True)
    TaskId = db.Column(db.Integer, db.ForeignKey("task.id"), nullable=False)
    CommentBy = db.Column(db.String(50), nullable=False)
    CommentBody = db.Column(db.Text())
    comment_date_time = db.Column(db.String(), nullable=False)
    old_filename = db.Column(db.String())
    new_filename = db.Column(db.String())
    file_url = db.Column(db.String())

    def __ref__(self):
        return f"<TaskCommentTable {self.CommentId}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


# EmployeeList
"""
class EmployeeList
    EmpEmailId:string primary_key
    EmpId: string
    EmpName: string
    EmpDepart: string
    EmpDesg: string
    EmpPlaceOfPosting: string
    EmpPhoto: text
    created_at: string
    updated_at: string
    AssignGroup: string
    isArchived:Integer
"""


class EmployeeList(db.Model):
    __tablename__ = "EmployeeList"
    EmpEmailId = db.Column(db.String(80), primary_key=True)
    EmpId = db.Column(db.String(), default="")
    EmpName = db.Column(db.String(50), nullable=False)
    EmpDepart = db.Column(db.String(), nullable=False)
    EmpDesg = db.Column(db.String(), default="")
    EmpPlaceOfPosting = db.Column(db.String(), default="")
    EmpPhoto = db.Column(db.Text(), default="")
    created_at = db.Column(db.String(), nullable=False)
    updated_at = db.Column(db.String(), default="")
    AssignGroup = db.Column(db.Text(), default="")
    MobileNo = db.Column(db.String(), default="")
    BloodGroup = db.Column(db.String(3), default="")
    isAdmin = db.Column(db.Integer, nullable=False, default=0)

    def __repr__(self):
        return f"<EmployeeList {self.EmpName}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def updateProfileSetting(
        self,
        EmpId,
        EmpDesg,
        EmpPlaceOfPosting,
        EmpPhoto,
        created_at,
        MobileNo,
        BloodGroup,
        EmpDepart,
    ):
        self.EmpId = EmpId
        self.EmpDesg = EmpDesg
        self.EmpPlaceOfPosting = EmpPlaceOfPosting
        self.EmpPhoto = EmpPhoto
        self.created_at = created_at
        self.MobileNo = MobileNo
        self.BloodGroup = BloodGroup
        self.EmpDepart = EmpDepart
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def updateAdminAsssignGroup(self, isAdmin, AssignGroup):
        self.isAdmin = isAdmin
        self.AssignGroup = AssignGroup
        db.session.commit()


class RaiseRequest(db.Model):
    __tablename__ = "raiseRequest"
    email = db.Column(db.String(80), primary_key=True)
    addToGroup = db.Column(db.Text(), default="")
    created_at = db.Column(db.String(), default="")

    def __repr__(self):
        return f"<RaiseRequest {self.EmpName}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class DepartmentList(db.Model):
    __tablename__ = "departmentList"
    id = db.Column(db.Integer, primary_key=True)
    depart = db.Column(db.String(), nullable=False)
    region = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return f"<DepartmentList {self.depart}>"

    def save(self):
        db.session.add(self)
        db.session.commit()