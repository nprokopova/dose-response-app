import logging
import connexion
import traceback
from flask import jsonify, send_from_directory
from werkzeug.exceptions import HTTPException

from app.config import STATIC_ROOT

log = logging.getLogger(__name__)


EXTRA_FILES = ["app/swagger.yaml"]


def create_app() -> connexion.App:
    connexion_app = connexion.App("designer-tools", specification_dir="app")
    connexion_app.add_api("swagger.yaml")

    flask_app = connexion_app.app
    flask_app.config.from_object("app.config")
    flask_app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

    @flask_app.route("/<static_file>.json")
    def root_static_json_file(static_file: str):  # type: ignore
        return send_from_directory(STATIC_ROOT, f"{static_file}.json")

    @flask_app.route("/<static_file>.ico")
    def root_static_ico_file(static_file: str):  # type: ignore
        return send_from_directory(STATIC_ROOT, f"{static_file}.ico")

    @flask_app.route("/static/media/<static_file>.svg")
    def root_static_svg_file(static_file: str):  # type: ignore
        return send_from_directory(f"{STATIC_ROOT}/static/media", f"{static_file}.svg")

    @flask_app.route("/static/js/<js_file>.js")
    def serve_js(js_file: str):  # type: ignore
        return send_from_directory(f"{STATIC_ROOT}/static/js/", f"{js_file}.js")

    @flask_app.route("/static/css/<css_file>.css")
    def serve_css(css_file: str):  # type: ignore
        return send_from_directory(f"{STATIC_ROOT}/static/css/", f"{css_file}.css")

    @flask_app.route("/")
    def serve_index():  # type: ignore
        return send_from_directory(STATIC_ROOT, "index.html")

    flask_app.register_error_handler(Exception, handle_exception)
    return connexion_app


def handle_exception(e: Exception) -> tuple[dict, int]:
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    trace = "".join(traceback.format_tb(e.__traceback__))
    response = jsonify(error=str(e), traceback=trace)
    log.error(response)
    return response, code


if __name__ == "__main__":
    the_app = create_app()
    flask_app = the_app.app
    the_app.run(
        port=flask_app.config["PORT"],
        host=flask_app.config["HOST"],
        debug=flask_app.config["DEBUG"],
        extra_files=EXTRA_FILES,
    )
