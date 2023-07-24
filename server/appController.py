from flask_mail import Message, Mail
from flask import request, jsonify, make_response, Flask, Response
import requests
from flask_restx import Resource, Namespace, fields
from models import (
    User,
    EmployeeList,
    Register_Temp,
    TaskCommentTable,
    Task,
    RaiseRequest,
    DepartmentList,
)
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    get_jwt,
)
import json
import time
from random import randint
import re
import os
from werkzeug.utils import secure_filename
import psycopg2
import psycopg2.extras
import os
import requests
import firebase_admin
from firebase_admin import credentials, messaging, initialize_app
from fcm_utils import FcmUtils
from dotenv import load_dotenv

load_dotenv()

messaging = FcmUtils()

app = Flask(__name__)

# mail Configuration
app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER")
app.config["MAIL_PORT"] = os.getenv("MAIL_PORT")
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_DEBUG"] = True
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
mail = Mail(app)

app.static_folder = "static"

# Allowed extension you can set your own
ALLOWED_EXTENSIONS = set(["pdf", "png", "jpg", "jpeg", "gif", "doc", "docs", "xlsx"])


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


app.config["JWT_DECODE_ALGORITHMS"] = ["HS256"]

api_ns = Namespace("api", description="A namespace for all api")


def db_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST_LOCAL"),
            port=os.getenv("DB_PORT"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD_LOCAL"),
            cursor_factory=psycopg2.extras.DictCursor,
        )
        print("Connected")
    except Exception as e:
        conn = None
        print("I'm unable to connect to database", e)
    return conn


signup_model = api_ns.model(
    "Signup",
    {
        "id": fields.Integer(),
        "fullname": fields.String(required=True, description="user full  name"),
        "email": fields.String(required=True, description="user email address"),
        "department": fields.String(required=True, description="user department"),
        "password": fields.String(required=True, description="user passwword"),
        "created_at": fields.String(required=True, description="User created at"),
    },
)

login_model = api_ns.model(
    "Login",
    {
        "email": fields.String(required=True, description="user email address"),
        "password": fields.String(required=True, description="user passwword"),
    },
)


def otpGenerate():
    otp = ""
    for i in range(6):
        otp += str(randint(0, 9))
    return otp


""" route for user authentication """


@api_ns.route("/new-user")
class NewUser(Resource):
    def post(self):
        data = request.get_json()  # get data from frontend
        email = data.get("email")
        otp = otpGenerate()

        db_user = User.query.filter_by(email=email).first()
        if db_user is not None:
            return jsonify({"msg": f"Email {email} already exists.", "type": "warning"})
        elif not re.match(r"[A-Za-z0-9._%+-]+@railtelindia\.com$", email):
            return jsonify(
                {
                    "msg": f"Email {email} is invalid email. Please, use railtelindia mail only.",
                    "type": "warning",
                }
            )
        else:
            email_registered = Register_Temp.query.filter_by(email=email).first()
            if email_registered:
                update_otp = Register_Temp.query.get_or_404(email_registered.id)
                update_otp.update_otp(otp)
            else:
                new_user = Register_Temp(email=email, otp=otp)
                new_user.save()

            msg = Message(
                subject="RailTel Task Manager - New User Registration",
                sender="fp@railtelindia.com",
                recipients=[email],
            )
            msg.body = "we apreciate you for taking your time. This is the OTP."
            msg.html = f"<p>Hey, <br /> Please use the verification code below to Verify Yourself</p> <strong>{otp}</strong> <p>--sent by RailTel Task Manager App</p><p>Regards, RailTel Task Manager Application.</p>"
            try:
                mail.send(msg)
            except:
                return jsonify({"msg": "Invalid Email Id", "type": "error"})
            result = jsonify(
                {
                    "msg": "Verification OTP has been sent to your email",
                    "type": "success",
                    "email": f"{email}",
                }
            )
        return result


@api_ns.route("/signup")  # A decorator to route resources
class Signup(Resource):
    def post(self):
        data = request.get_json()  # get data from frontend
        email = data.get("email")
        fullname = data.get("fullname")
        # now = datetime.datetime.now()
        created_at = time.time()
        department = (data.get("department"),)
        user_otp = data.get("otp")
        new_otp = otpGenerate()

        db_user = Register_Temp.query.filter_by(otp=user_otp).first()
        if db_user is None:
            return jsonify({"msg": "Your OTP is wrong, try again.", "type": "error"})

        if db_user:
            update_otp = Register_Temp.query.get_or_404(db_user.id)
            update_otp.update_otp(new_otp)
            # insert values into EmployeeList table
            new_employee = EmployeeList(
                EmpEmailId=email,
                EmpName=fullname,
                EmpDepart=department,
                created_at=created_at,
                AssignGroup=department,
            )
            new_employee.save()

            # insert values into user table
            new_user = User(
                fullname=fullname,
                email=email,
                department=department,
                created_at=created_at,
                password=generate_password_hash(data.get("password")),
                otp=user_otp,
            )
            new_user.save()
        return jsonify(
            {"msg": f"user {fullname} Created Successfully", "type": "success"}
        )


@api_ns.route("/login")
class Login(Resource):
    def post(self):
        data = request.get_json()  # get data from frontend

        email = data.get("email")
        password = data.get("password")

        db_user = User.query.filter_by(email=email).first()
        db_user_assign_group = EmployeeList.query.filter_by(EmpEmailId=email).first()

        if db_user is None:
            return jsonify(
                {
                    "msg": "You are not Registered. please, Create new count.",
                    "type": "error",
                }
            )

        if db_user and check_password_hash(db_user.password, password):
            # access_token = create_access_token(identity=db_user.email)
            additional_claims = {
                "fullname": f"{db_user.fullname}",
                "email": f"{db_user.email}",
                "department": f"{db_user.department}",
                "AssignGroup": f"{db_user_assign_group.AssignGroup}",
            }
            access_token = create_access_token(
                db_user.email, additional_claims=additional_claims
            )

            return jsonify({"access_token": access_token, "type": "success"})
        else:
            return jsonify({"msg": "Your password is wrong.", "type": "error"})


@api_ns.route("/forgotpassword")
class ForgotPassword(Resource):
    def put(self):
        data = request.get_json()
        email = data.get("email")
        otp = otpGenerate()

        # Check email in Database, and fetch users data, if availabble in database
        db_user = User.query.filter_by(email=email).first()

        if db_user is None:
            return jsonify(
                {
                    "msg": "You are not Registered. please, Create new account.",
                    "type": "error",
                }
            )

        if db_user:
            # Fetch one record and return result
            msg = Message(
                subject="RailTel Task Manager - Password Reset",
                sender="fp@railtelindia.com",
                recipients=[email],
            )
            msg.body = "we apreciate you for taking your time. This is the OTP."
            msg.html = f"<p>Hey, {db_user.fullname} <br /> Please use the verification code below to Reset password:</p> <strong>{otp}</strong> <p>--sent by RailTel Task Manager App</p><p>Regards, RailTel Task Manager Application.</p>"
            mail.send(msg)

            update_otp = User.query.get_or_404(db_user.id)
            update_otp.update_otp(otp)

            result = jsonify(
                {
                    "msg": "Reset OTP has been sent to",
                    "type": "success",
                    "email": f"{db_user.email}",
                }
            )
        else:
            result = jsonify({"msg": "this user does not exist", "type": "error"})
        return result


@api_ns.route("/resetpassword")
class ResetPassword(Resource):
    def put(self):
        data = request.get_json()
        password = generate_password_hash(data.get("password"))
        user_otp = data.get("otp")
        new_otp = otpGenerate()

        db_user = User.query.filter_by(otp=user_otp).first()

        if db_user is None:
            return jsonify({"msg": "Your OTP is wrong, try again.", "type": "error"})

        if db_user:
            # Check token in Database, and fetch users data, if availabble in database
            upadte_password = User.query.get_or_404(db_user.id)
            upadte_password.upadte_password(new_otp, password)
            result = jsonify(
                {"msg": f"Your password updated successfully", "type": "success"}
            )
        else:
            result = jsonify({"msg": "Your token has expired", "type": "error"})
        return result


@api_ns.route("/refresh")
class RefreshResource(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)

        return make_response(jsonify({"access_token": new_access_token}), 200)


""" route for employee list """

###Serialize model into json format (serialize) ###
EmployeeList_model = api_ns.model(
    "EmployeeList",
    {
        "EmpEmailId": fields.String(),
        "EmpId": fields.String(),
        "EmpName": fields.String(),
        "EmpDepart": fields.String(),
        "EmpDesg": fields.String(),
        "EmpPlaceOfPosting": fields.String(),
        "EmpPhoto": fields.String(),
        "created_at": fields.String(),
        "updated_at": fields.String(),
        "AssignGroup": fields.String(),
        "MobileNo": fields.String(),
        "BloodGroup": fields.String(),
        "isAdmin": fields.Integer(),
    },
)


@api_ns.route("/EmployeeList")
class EmployeeListsResource(Resource):
    @api_ns.marshal_list_with(EmployeeList_model)
    @jwt_required()
    def get(self):
        """get all EmployeeList from database"""
        employee = EmployeeList.query.all()
        return employee


@api_ns.route("/employee/updateByAdmin/<EmpEmail>")
class UpdateByAdmin(Resource):
    @jwt_required()
    def put(self, EmpEmail):
        """update admin status and assign group by admin"""
        data = request.get_json()
        if EmpEmail:
            isAdmin = data.get("isAdmin")
            AssignGroup = data.get("AssignGroup")
            updateData = EmployeeList.query.get_or_404(EmpEmail)
            updateData.updateAdminAsssignGroup(isAdmin, AssignGroup)
            return jsonify({"msg": "admin and Assign group has been updated"})
        else:
            return jsonify({"msg": "you are not authorise to Update user data"})


@api_ns.route("/user/employee/<EmpEmail>")
class EmployeeListResource(Resource):
    @jwt_required()
    def put(self, EmpEmail):
        """update task by EmpEmailId"""
        claims = get_jwt()
        data = request.get_json()
        # now = datetime.datetime.now()
        if claims["email"] == EmpEmail:
            EmpId = data.get("EmpId")
            EmpDesg = data.get("EmpDesg")
            EmpPlaceOfPosting = data.get("EmpPlaceOfPosting")
            EmpPhoto = data.get("EmpPhoto")
            updated_at = (time.time(),)
            MobileNo = data.get("MobileNo")
            BloodGroup = data.get("BloodGroup")
            EmpDepart = data.get("EmpDepart")
            emp_details_to_update = EmployeeList.query.get_or_404(EmpEmail)
            emp_details_to_update.updateProfileSetting(
                EmpId,
                EmpDesg,
                EmpPlaceOfPosting,
                EmpPhoto,
                updated_at,
                MobileNo,
                BloodGroup,
                EmpDepart,
            )
            return jsonify({'"msg': "your profile has been updated"})
        else:
            return jsonify({"msg": "you are not authorise to Update user data"})


""" routes for task comment table """

###Serialize model into json format (serialize) ###
TaskCommentTable_model = api_ns.model(
    "TaskCommentTable",
    {
        "CommentId": fields.Integer(),
        "TaskId": fields.Integer(),
        "CommentBy": fields.String(),
        "CommentBody": fields.String(),
        "comment_date_time": fields.String(),
        "old_filename": fields.String(),
        "new_filename": fields.String(),
        "file_url": fields.String(),
    },
)


@api_ns.route("/comments")
class TasksCommentTableResource(Resource):
    @api_ns.marshal_with(TaskCommentTable_model)
    @api_ns.expect(TaskCommentTable_model)
    @jwt_required()
    def post(self):
        """Create a new Comment"""
        claims = get_jwt()
        epoch_time = time.time()
        data = request.get_json()
        TaskId = data.get("TaskId")
        # making an object to store the new comment data
        new_comment = TaskCommentTable(
            CommentBy=claims["fullname"],
            TaskId=TaskId,
            CommentBody=data.get("CommentBody"),
            # '05:19 PM Dec 06, 2022' format for date_time
            comment_date_time=epoch_time,
        )
        new_comment.save()

        # update value of date_time_update in Task table
        date_time_update_in_task = Task.query.get_or_404(TaskId)
        date_time_update_in_task.date_time_update_function(epoch_time)

        return new_comment


@api_ns.route("/comments/<int:TaskId>")
class TaskCommentTableResource(Resource):
    @api_ns.marshal_list_with(TaskCommentTable_model)
    @jwt_required()
    def get(self, TaskId):
        """get all Comments by task id"""
        comments = (
            TaskCommentTable.query.filter_by(TaskId=TaskId)
            .order_by(TaskCommentTable.CommentId.desc())
            .all()
        )
        return comments

    @jwt_required()
    def delete(self, TaskId):
        """delete comments by id"""

        comments_to_delete = TaskCommentTable.query.filter_by(TaskId=TaskId).all()
        for comments in comments_to_delete:
            comments.delete()
        return jsonify({"msg": "your comments has been deleted"})


def upload_file_to_nextcloud(file_path, nextcloud_url, username, password, file_data):
    upload_url = f"{nextcloud_url}/remote.php/dav/files/{username}/{file_path}"
    headers = {"OCS-APIRequest": "true"}

    # with open(file_path, 'rb') as file:
    #     file_data = file.read()

    print("\n\n\n\n\n\n")
    print("inside upload_file_to_nextcloud first")
    response = requests.put(
        upload_url,
        data=file_data,
        headers=headers,
        auth=(username, password),
    )
    print("\n\n\n\n\n\n")
    print("inside upload_file_to_nextcloud second")

    if response.status_code == 201:
        print("\n\n\n\n\n\n\n\n\n\n")
        print("File uploaded successfully.")
    else:
        print("\n\n\n\n\n\n\n\n\n\n")
        print("Failed to upload file. Status code:", response.status_code)


@api_ns.route("/uploadFile")
class UploadFile(Resource):
    # @api_ns.marshal_with(TaskCommentTable_model)
    # @api_ns.expect(TaskCommentTable_model)
    @jwt_required()
    def post(self):
        """upload files"""
        claims = get_jwt()
        epoch_time = time.time()
        files = request.files.getlist("files")
        TaskId = request.form["TaskId"]

        # Iterate for each file in the files List, and Save them
        for file in files:
            print("\n\n\n\n")
            print(file.filename)

            # file_path = "test"
            # nextcloud_url = "https://192.168.137.122/nextcloud"
            # username = "farooque"
            # password = "Farooque@123"

            # nc = nextcloud_client.Client(nextcloud_url)

            # nc.login(username, password)

            # nc.mkdir("testdir")

            # nc.put_file(
            #     "testdir/remotefile.txt", "/important downloads for deployment.txt"
            # )

            # link_info = nc.share_file_with_link("testdir/remotefile.txt")

            # print("\n\n\n\n\n\n", "Here is your link: " + link_info.get_link())

            # file_data = file.read()
            # upload_file_to_nextcloud(
            #     file_path, nextcloud_url, username, password, file_data
            # )

            # print("\n\n")
            # print(file_data)
            # url = f"{nextcloud_url}/remote.php/dav/files/{username}/{file_path}"
            # headers = {'Authorization': 'Bearer YOUR-API-TOKEN'}
            # response = requests.put(url, data=file_data, headers=headers)

            # if response.status_code == 201:
            #     return jsonify({"message": 'File uploaded successfully!'})
            # else:
            #     return jsonify({"message": "Failed to upload file"})

            # old_filename = secure_filename(file.filename)
            # new_filename = secrets.token_hex(12)
            # file.save(os.path.join(app.static_folder, new_filename))

            # if file and allowed_file(file.filename):
            #     new_comment = TaskCommentTable(
            #         CommentBy=claims["fullname"],
            #         TaskId=TaskId,
            #         comment_date_time=epoch_time,
            #         old_filename=old_filename,
            #         new_filename=new_filename,
            #     )
            #     new_comment.save()

            #     # update value of date_time_update in Task table
            #     date_time_update_in_task = Task.query.get_or_404(TaskId)
            #     date_time_update_in_task.date_time_update_function(epoch_time)

            # else:
            #     return jsonify(
            #         {
            #             "status": "error",
            #             "message": "File upload failed.file type mot allowed",
            #         }
            #     )

        return jsonify({"message": "Files uploaded successfully"})


""" routes for all the tasks """

###Serialize model into json format (serialize) ###
task_model = api_ns.model(
    "Task",
    {
        "id": fields.Integer(),
        "title": fields.String(),
        "description": fields.String(),
        "action_team": fields.String(),
        "info_team": fields.String(),
        "date_time_create": fields.String(),
        "date_time_archive": fields.String(),
        "date_time_update": fields.String(),
        "created_by": fields.String(),
        "isArchived": fields.Integer(),
        "archive_by": fields.String(),
        "taskProgress": fields.String(),
    },
)


@api_ns.route("/tasks/updateDescription/<int:id>")
class UpdateDescription(Resource):
    @jwt_required()
    def put(self, id):
        """update description"""
        data = request.get_json()
        description = data.get("description")
        update_descr = Task.query.get_or_404(id)
        update_descr.update_new_description(description)

        return jsonify({"message": "Description updated successfully"})


@api_ns.route("/tasks/addNewActionTeam/<int:id>")
class AddNewActionTeam(Resource):
    @jwt_required()
    def put(self, id):
        """add New Action Team in task table"""
        claims = get_jwt()
        data = request.get_json()
        created_by = data.get("created_by")
        action_team = (data.get("action_team"),)

        if created_by == claims["fullname"]:
            add_new_team = Task.query.get_or_404(id)
            add_new_team.addNewActionTeam(action_team)
            return jsonify({"msg": "you have added New Action Team in task table"})
        else:
            return jsonify(
                {"msg": f"{claims['fullname']}, you are not authorise, to add new team"}
            )


@api_ns.route("/tasks/addNewInfoTeam/<int:id>")
class AddNewInfoTeam(Resource):
    @jwt_required()
    def put(self, id):
        """add New Info Team in task table"""
        claims = get_jwt()
        data = request.get_json()
        created_by = data.get("created_by")
        info_team = (data.get("info_team"),)

        if created_by == claims["fullname"]:
            add_new_team = Task.query.get_or_404(id)
            add_new_team.addNewInfoTeam(info_team)
            return jsonify({"msg": f"you have added New Info Team in task table"})
        else:
            return jsonify(
                {"msg": f"{claims['fullname']}, you are not authorise, to add new team"}
            )


@api_ns.route("/tasks/myTasks")
class MyTasksResource(Resource):
    @api_ns.marshal_list_with(task_model)
    @jwt_required()
    def get(self):
        """get all tasks"""
        claims = get_jwt()
        created_by = (claims["fullname"],)

        tasks = (
            Task.query.filter(Task.created_by == created_by, Task.isArchived == 0)
            .order_by(Task.date_time_update.desc())
            .all()
        )

        return tasks


@api_ns.route("/tasks/archives")
class ArchivesResource(Resource):
    @api_ns.marshal_list_with(task_model)
    @jwt_required()
    def get(self):
        """get all tasks"""
        claims = get_jwt()
        created_by = (claims["fullname"],)
        tasks = (
            Task.query.filter(Task.created_by == created_by, Task.isArchived == 1)
            .order_by(Task.date_time_update.desc())
            .all()
        )
        return tasks


@api_ns.route("/tasks/actionable")
class ActionableResource(Resource):
    @api_ns.marshal_list_with(task_model)
    @jwt_required()
    def get(self):
        """get all tasks"""
        claims = get_jwt()
        created_by = (claims["fullname"],)

        tasks = (
            Task.query.filter(
                Task.action_team.contains(created_by), Task.isArchived == 0
            )
            .order_by(Task.date_time_update.desc())
            .all()
        )

        return tasks


@api_ns.route("/tasks/informational")
class ActionableResource(Resource):
    @api_ns.marshal_list_with(task_model)
    @jwt_required()
    def get(self):
        """get all tasks"""
        claims = get_jwt()
        created_by = (claims["fullname"],)

        tasks = (
            Task.query.filter(Task.info_team.contains(created_by), Task.isArchived == 0)
            .order_by(Task.date_time_update.desc())
            .all()
        )

        return tasks


@api_ns.route("/tasks")
class TasksResource(Resource):
    @api_ns.marshal_list_with(task_model)
    @jwt_required()
    def get(self):
        """get all tasks"""
        claims = get_jwt()
        created_by = (claims["fullname"],)

        tasks = Task.query.order_by(Task.id.desc()).all()

        return tasks

    @api_ns.marshal_with(task_model)
    @api_ns.expect(task_model)
    @jwt_required()
    def post(self):
        """create a new task"""
        claims = get_jwt()
        data = request.get_json()
        # making an object to store the task data
        new_task = Task(
            title=data.get("title"),
            description=data.get("description"),
            action_team=data.get("action_team"),
            info_team=data.get("info_team"),
            # '05:19 PM Dec 06, 2022' format for date_time
            date_time_create=time.time(),
            date_time_update=time.time(),
            created_by=claims["fullname"],
            isArchived=0,
            date_time_archive="",
            archive_by="",
            taskProgress=0,
        )

        new_task.save()
        return new_task


@api_ns.route("/task/progress/<int:id>")
class taskProgress(Resource):
    @api_ns.marshal_list_with(task_model)
    @jwt_required()
    def get(self, id):
        """get task progress information by id"""
        tasks = Task.query.filter_by(id=id).all()
        return tasks

    @jwt_required()
    def put(self, id):
        """update task progress information by id"""
        data = request.get_json()
        taskProgress = data.get("taskProgress")
        tasks = Task.query.get_or_404(id)
        tasks.updateProgressBar(taskProgress)
        return jsonify({"msg": "work in progress data has been updated successfully"})


@api_ns.route("/task/<int:id>")
class TaskArchiveResource(Resource):
    @jwt_required()
    def put(self, id):
        """archive task by id"""
        claims = get_jwt()
        data = request.get_json()
        date_time_archive = (time.time(),)
        isArchived = data.get("isArchived")
        archive_by = data.get("archive_by")

        if archive_by == claims["fullname"]:
            task_to_archive = Task.query.get_or_404(id)
            task_to_archive.archive(date_time_archive, isArchived, archive_by)

            # return task_to_archive
            return jsonify({"msg": f"your task has been archived"})

        else:
            return jsonify(
                {"msg": f"{claims['fullname']}, you are not authorise, to Archive"}
            )

    @jwt_required()
    def delete(self, id):
        """delete task by id"""
        task_to_delete = Task.query.get_or_404(id)
        task_to_delete.delete()
        return jsonify({"msg": "your task has been deleted"})


@api_ns.route("/task/unarchive/<int:id>")
class TaskUnarchiveResource(Resource):
    @jwt_required()
    def put(self, id):
        """unarchive task by id"""
        claims = get_jwt()
        data = request.get_json()
        isArchived = 0
        archive_by = data.get("archive_by")

        if archive_by == claims["fullname"]:
            task_to_archive = Task.query.get_or_404(id)
            task_to_archive.unarchive(isArchived)
            return jsonify({"msg": f"your task has been Unarchived"})

        else:
            return jsonify(
                {"msg": f"{claims['fullname']}, you are not authorise, to Unarchive"}
            )


# serilaze RaiseRequest model
RaiseRequest_model = api_ns.model(
    "RaiseRequest",
    {
        "email": fields.String(),
        "addToGroup": fields.String(),
        "created_at": fields.String(),
    },
)


@api_ns.route("/add-to-group")
class AddToGroup(Resource):
    @api_ns.marshal_list_with(RaiseRequest_model)
    @jwt_required()
    def get(self):
        """get all AddToGroup from database"""
        raiseRequest = RaiseRequest.query.all()
        return raiseRequest


@api_ns.route("/add-to-group/<email>")
class AddToGroupWithEmail(Resource):
    @jwt_required()
    def post(self, email):
        """create new add to group"""
        data = request.get_json()
        # now = datetime.datetime.now()

        # making an object to store data
        new_group = RaiseRequest(
            email=email,
            addToGroup=data.get("addToGroup"),
            # '05:19 PM Dec 06, 2022' format for date_time
            created_at=time.time(),
        )
        try:
            new_group.save()
            return jsonify({"msg": "group add submitted Successfully"})
        except:
            return jsonify({"msg": "You have already Requested for group add."})

    @jwt_required()
    def delete(self, email):
        """delete task by id"""
        add_to_group = RaiseRequest.query.get_or_404(email)
        add_to_group.delete()
        return jsonify({"msg": "your add_to_group has been deleted"})


# serialize DepartmentList_model model
DepartmentList_model = api_ns.model(
    "DepartmentList",
    {
        "depart": fields.String(),
        "region": fields.String(),
    },
)


@api_ns.route("/add-department")
class DepartmentListt(Resource):
    @api_ns.marshal_list_with(DepartmentList_model)
    def get(self):
        """get all AddToGroup from database"""
        depart_list = DepartmentList.query.order_by(DepartmentList.depart).all()
        return depart_list

    @jwt_required()
    def post(self):
        """add new department list"""
        data = request.get_json()

        # making an object to store data
        new_depart = DepartmentList(
            depart=data.get("depart"),
            region=data.get("region"),
        )

        new_depart.save()
        return jsonify(
            {
                "msg": f"department {data.get('depart')} and Region {data.get('region')} added Successfully"
            }
        )


# feat: notification related url and controller


"""functions for notification related url and controller"""


# retrieve tokens for a user
def retrieve_tokens(email):
    conn = db_connection()
    cursor = conn.cursor()
    cursor.execute("""SELECT * FROM "pushNotification" WHERE email=%s""", (email,))
    user_details = cursor.fetchone()
    cursor.close()
    conn.close()

    if user_details is not None:
        tokens = []
        if user_details[1] is not None:
            tokens.append(user_details[1])
        if user_details[2] is not None:
            tokens.append(user_details[2])
        return tokens


def retrieve_emails(names):
    """getting emails according to their name"""
    conn = db_connection()
    cursor = conn.cursor()
    emails = []

    for name in names:
        cursor.execute("""SELECT email FROM "user" WHERE fullname=%s""", (name,))
        user_details = cursor.fetchone()
        emails.append(user_details[0])
    cursor.close()
    conn.close()
    return emails


# Route to store/update tokens for a user
@api_ns.route("/store-tokens")
class StoreTokens(Resource):
    @jwt_required()
    def post(self):
        """store/update tokens for a user"""
        claims = get_jwt()
        conn = db_connection()
        cursor = conn.cursor()
        email = claims["email"]  # getting email of the user loggedin.
        user_agent = request.headers.get("User-Agent").lower()
        if "mobile" in user_agent:
            token_type = "mobile_token"
        else:
            token_type = "laptop_token"
        token = request.json["token"]

        cursor.execute("""SELECT * FROM "pushNotification" WHERE email=%s""", (email,))
        user = cursor.fetchone()

        if user is not None:  # Update the user's tokens
            # print("inside update")
            cursor.execute(
                f"""UPDATE "pushNotification" SET "{token_type}"=%s WHERE email=%s""",
                (token, email),
            )
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Token Updated successfully"})
        else:
            # save new token
            # print("inside store")
            cursor.execute(
                f"""INSERT INTO "pushNotification" (email, "{token_type}") VALUES(%s, %s)""",
                (email, token),
            )
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Token Stored successfully"})


@api_ns.route("/send-notification-to-multiple")
class SendNotificationToMultiple(Resource):
    @jwt_required()
    def post(self):
        """send notification to multiple users"""
        data = request.get_json()
        claims = get_jwt()

        emails = data["emails"]
        title = data["header"]
        if data["type"] == "new_task":
            body = f'By {claims["fullname"]} with title {data["body"]}'
        elif data["type"] == "new_comment":
            body = f'By {claims["fullname"]} - {data["body"]} to Task {data["title"]}'
            if emails[0] != "":
                emails = retrieve_emails(emails)
            else:
                emails = []
        elif data["type"] == "add_new_team":
            body = f'By {claims["fullname"]} to Task {data["title"]}'

        for email in emails:
            tokens = retrieve_tokens(email)
            if tokens is not None:
                messaging.send_to_token_multicast(tokens, title, body)
        return jsonify({"status": "success"})
