import os.path
import pickle
from pathlib import Path
from typing import List

from google.oauth2 import service_account
from googleapiclient.discovery import build

from flask import Flask, jsonify
from flask_cors import CORS

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']


# The ID and range of a sample spreadsheet.


def request_google_data(range_name: str):
    spreadsheet_id = os.environ["SpreadSheetID"]
    credentials = service_account.Credentials.from_service_account_file("credentials.json", scopes=[
        "https://www.googleapis.com/auth/spreadsheets.readonly"])

    service = build('sheets', 'v4', credentials=credentials)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=spreadsheet_id,
                                range=range_name).execute()
    values = result.get('values', [])
    return values


class Data:
    flask_app: Flask
    data_cache: List
    file_path: Path

    def __init__(self, flask_app: Flask):
        self.flask_app = flask_app
        self.file_path = (Path(__file__).parent / "data.pickle")
        if self.file_path.is_file():
            self.flask_app.logger.info("Data loaded from cache")
            with self.file_path.open("rb") as f:
                self.data_cache = pickle.load(f)
        else:
            self.flask_app.logger.warning("Data cache not found")
            self.pull_fresh()

    def pull_fresh(self):
        self.flask_app.logger.info("Pulling fresh data from google sheets")
        self.data_cache = request_google_data("Sheet1!A2:B")
        self.flask_app.logger.info(f"The data that has been requested: {self.data_cache}")

        with open(self.file_path, "wb") as f:
            pickle.dump(self.data_cache, f)


app = Flask(__name__, static_url_path="/", static_folder="./build")
data = Data(app)
CORS(app)

api_prefix = "/api"


@app.route(f"{api_prefix}/pull_fresh_data", methods=["GET"])
def pull_fresh_data():
    data.pull_fresh()
    return jsonify(data.data_cache)


@app.route(f"{api_prefix}/get_data", methods=["GET"])
def retrieve_sheets_data():
    return jsonify(data.data_cache)


@app.route("/", methods=["GET"])
def index():
    return app.send_static_file("index.html")


if __name__ == '__main__':

    env_vars = ['SpreadSheetID']

    for key in env_vars:
        if key not in os.environ:
            app.logger.error(f"env variable {key} missing. Could not start the app")
            exit(0)
    app.run(host="127.0.0.1", port=8000)
