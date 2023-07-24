from flask import Flask, request, jsonify
from flask_restx import Api
from models import (
    User,
    Task,
    TaskCommentTable,
    EmployeeList,
    RaiseRequest,
    DepartmentList,
)
from exts import db
from flask_jwt_extended import JWTManager
from appController import api_ns
from config import DevConfig, ProdConfig
from flask_cors import CORS
from flask_mail import Mail
from dotenv import load_dotenv
import os

load_dotenv()

#app = Flask(__name__, static_url_path='/', static_folder='../client/build')
app = Flask(__name__)
app.config.from_object(DevConfig)
db.init_app(app)

# mail Configuration
app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER")
app.config["MAIL_PORT"] = os.getenv("MAIL_PORT")
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_DEBUG"] = True
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
mail = Mail(app)


CORS(app, origins=[os.getenv("CORS_ORIGIN")])

JWTManager(app)

api = Api(app, doc="/docs")
api.add_namespace(api_ns)


# @app.route('/')
# def index():
#     return app.send_static_file('index.html')


# @app.errorhandler(404)
# def not_found(err):
#     return app.send_static_file('index.html')


@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "User": User,
        "Task": Task,
        "TaskCommentTable": TaskCommentTable,
        "EmployeeList": EmployeeList,
        "RaiseRequest": RaiseRequest,
        "DepartmentList": DepartmentList,
    }


if __name__ == "__main__":
    app.app_context().push()
    db.create_all()
    app.run(debug=True, host="0.0.0.0", port=5000)
